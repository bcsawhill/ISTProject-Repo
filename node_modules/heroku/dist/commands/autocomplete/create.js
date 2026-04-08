import debug from 'debug';
import fs from 'fs-extra';
import { fileURLToPath } from 'node:url';
import * as path from 'path';
import { AutocompleteBase } from '../../lib/autocomplete/base.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const debugLog = debug('autocomplete:create');
const AC_LIB_PATH = path.resolve(__dirname, '..', '..', '..', 'autocomplete-scripts');
export default class Create extends AutocompleteBase {
    static hidden = true;
    static description = 'create autocomplete setup scripts and completion functions';
    _commands;
    async run() {
        this.errorIfWindows();
        // 1. ensure needed dirs
        await this.ensureDirs();
        // 2. save (generated) autocomplete files
        await this.createFiles();
    }
    async ensureDirs() {
        // ensure autocomplete cache dir
        await fs.ensureDir(this.autocompleteCacheDir);
        // ensure autocomplete completions dir
        await fs.ensureDir(this.completionsCacheDir);
    }
    async createFiles() {
        await fs.writeFile(this.bashSetupScriptPath, this.bashSetupScript);
        await fs.writeFile(this.zshSetupScriptPath, this.zshSetupScript);
        await fs.writeFile(this.bashCommandsListPath, this.bashCommandsList);
        await fs.writeFile(this.zshCompletionSettersPath, this.zshCompletionSetters);
    }
    get bashSetupScriptPath() {
        // <cacheDir>/autocomplete/bash_setup
        return path.join(this.autocompleteCacheDir, 'bash_setup');
    }
    get bashCommandsListPath() {
        // <cacheDir>/autocomplete/commands
        return path.join(this.autocompleteCacheDir, 'commands');
    }
    get zshSetupScriptPath() {
        // <cacheDir>/autocomplete/zsh_setup
        return path.join(this.autocompleteCacheDir, 'zsh_setup');
    }
    get zshCompletionSettersPath() {
        // <cacheDir>/autocomplete/commands_setters
        return path.join(this.autocompleteCacheDir, 'commands_setters');
    }
    get skipEllipsis() {
        return process.env.HEROKU_AC_ZSH_SKIP_ELLIPSIS === '1';
    }
    get commands() {
        if (this._commands)
            return this._commands;
        const { plugins } = this.config;
        const commands = [];
        plugins.forEach(p => {
            p.commands.forEach(c => {
                if (c.hidden)
                    return;
                try {
                    commands.push(c);
                }
                catch (error) {
                    debugLog(`Error creating completions for command ${c.id}`);
                    debugLog(error.message);
                    this.writeLogFile(error.message).catch(error => {
                        debugLog(`Failed to write log file: ${error.message}`);
                    });
                }
            });
        });
        this._commands = commands;
        return this._commands;
    }
    get bashCommandsList() {
        return this.commands.map(c => {
            try {
                const publicFlags = this.genCmdPublicFlags(c).trim();
                return `${c.id} ${publicFlags}`;
            }
            catch (error) {
                debugLog(`Error creating bash completion for command ${c.id}, moving on...`);
                debugLog(error.message);
                this.writeLogFile(error.message).catch(error => {
                    debugLog(`Failed to write log file: ${error.message}`);
                });
                return '';
            }
        }).join('\n');
    }
    get zshCompletionSetters() {
        const cmdsSetter = this.zshCommandsSetter;
        const flagSetters = this.zshCommandsFlagsSetters;
        return `${cmdsSetter}\n${flagSetters}`;
    }
    get zshCommandsSetter() {
        const cmdsWithDescriptions = this.commands.map(c => {
            try {
                return this.genCmdWithDescription(c);
            }
            catch (error) {
                debugLog(`Error creating zsh autocomplete for command ${c.id}, moving on...`);
                debugLog(error.message);
                this.writeLogFile(error.message).catch(error => {
                    debugLog(`Failed to write log file: ${error.message}`);
                });
                return '';
            }
        });
        return this.genZshAllCmdsListSetter(cmdsWithDescriptions);
    }
    get zshCommandsFlagsSetters() {
        return this.commands.map(c => {
            try {
                return this.genZshCmdFlagsSetter(c);
            }
            catch (error) {
                debugLog(`Error creating zsh autocomplete for command ${c.id}, moving on...`);
                debugLog(error.message);
                this.writeLogFile(error.message).catch(error => {
                    debugLog(`Failed to write log file: ${error.message}`);
                });
                return '';
            }
        }).join('\n');
    }
    genCmdPublicFlags(command) {
        const Flags = command.flags || {};
        return Object.keys(Flags)
            .filter(flag => !Flags[flag].hidden)
            .map(flag => `--${flag}`)
            .join(' ');
    }
    genCmdWithDescription(command) {
        let description = '';
        if (command.description) {
            const text = command.description.split('\n')[0];
            description = `:"${text}"`;
        }
        return `"${command.id.replace(/:/g, '\\:')}"${description}`;
    }
    genZshCmdFlagsSetter(command) {
        const { id, flags: commandFlags = {} } = command;
        const flagscompletions = Object.keys(commandFlags)
            .filter(flag => !commandFlags[flag].hidden)
            .map(flag => {
            const f = commandFlags[flag] || { description: '' };
            const isBoolean = f.type === 'boolean';
            const hasCompletion = 'completion' in f || this.findCompletion(id, flag, f.description);
            const name = isBoolean ? flag : `${flag}=-`;
            let cachecompl = '';
            if (hasCompletion) {
                cachecompl = ': :_compadd_flag_options';
            }
            if (this.wantsLocalFiles(flag)) {
                cachecompl = ': :_files';
            }
            const help = isBoolean ? '(switch) ' : (hasCompletion ? '(autocomplete) ' : '');
            const completion = `--${name}[${help}${f.description}]${cachecompl}`;
            return `"${completion}"`;
        })
            .join('\n');
        if (flagscompletions) {
            return `_set_${id.replace(/:/g, '_')}_flags () {
_flags=(
${flagscompletions}
)
}
`;
        }
        return `# no flags for ${id}`;
    }
    genZshAllCmdsListSetter(cmdsWithDesc) {
        return `
_set_all_commands_list () {
_all_commands_list=(
${cmdsWithDesc.join('\n')}
)
}
`;
    }
    get envAnalyticsDir() {
        return `HEROKU_AC_ANALYTICS_DIR=${path.join(this.autocompleteCacheDir, 'completion_analytics')};`;
    }
    get envCommandsPath() {
        return `HEROKU_AC_COMMANDS_PATH=${path.join(this.autocompleteCacheDir, 'commands')};`;
    }
    get bashSetupScript() {
        return `${this.envAnalyticsDir}
${this.envCommandsPath}
HEROKU_AC_BASH_COMPFUNC_PATH=${AC_LIB_PATH}/bash/heroku.bash && test -f $HEROKU_AC_BASH_COMPFUNC_PATH && source $HEROKU_AC_BASH_COMPFUNC_PATH;
`;
    }
    get zshSetupScript() {
        return `${this.skipEllipsis ? '' : this.completionDotsFunc}
${this.envAnalyticsDir}
${this.envCommandsPath}
HEROKU_AC_ZSH_SETTERS_PATH=\${HEROKU_AC_COMMANDS_PATH}_setters && test -f $HEROKU_AC_ZSH_SETTERS_PATH && source $HEROKU_AC_ZSH_SETTERS_PATH;
fpath=(
${AC_LIB_PATH}/zsh
$fpath
);
autoload -Uz compinit;
compinit;
`;
    }
    get completionDotsFunc() {
        return `expand-or-complete-with-dots() {
  echo -n "..."
  zle expand-or-complete
  zle redisplay
}
zle -N expand-or-complete-with-dots
bindkey "^I" expand-or-complete-with-dots`;
    }
    wantsLocalFiles(flag) {
        return [
            'file',
            'procfile',
        ].includes(flag);
    }
}
