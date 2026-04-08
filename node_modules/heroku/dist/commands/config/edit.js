import { color, hux } from '@heroku/heroku-cli-util';
import { Command, flags } from '@heroku-cli/command';
import { Args, ux } from '@oclif/core';
import _ from 'lodash';
import { parse, quote } from '../../lib/config/quote.js';
import { EditorFactory } from '../../lib/config/util.js';
function configToString(config) {
    return Object.keys(config)
        .sort()
        .map(key => `${key}=${quote(config[key])}`)
        .join('\n');
}
function removeDeleted(newConfig, original) {
    for (const k of Object.keys(original)) {
        // The api accepts empty strings
        // as valid env var values
        // In JS an empty string is false
        if (!newConfig[k] && newConfig[k] !== '')
            newConfig[k] = null;
    }
}
export function stringToConfig(s) {
    return s.split('\n').reduce((config, line) => {
        const error = () => {
            throw new Error(`Invalid line: ${line}`);
        };
        if (!line)
            return config;
        const i = line.indexOf('=');
        if (i === -1)
            error();
        config[line.slice(0, i)] = parse(line.slice(i + 1)) || '';
        return config;
    }, {});
}
function allKeys(a, b) {
    return _.uniq([...Object.keys(a), ...Object.keys(b)].sort());
}
function showDiff(from, to) {
    for (const k of allKeys(from, to)) {
        if (from[k] === to[k])
            continue;
        if (k in from) {
            ux.stdout(color.red(`- ${k}=${quote(from[k])}`));
        }
        if (k in to) {
            ux.stdout(color.green(`+ ${k}=${quote(to[k])}`));
        }
    }
}
export default class ConfigEdit extends Command {
    static args = {
        key: Args.string({ description: 'edit a single key', optional: true }),
    };
    static description = `interactively edit config vars
This command opens the app config in a text editor set by $VISUAL or $EDITOR.
Any variables added/removed/changed will be updated on the app after saving and closing the file.`;
    static examples = [
        `# edit with vim
${color.command('EDITOR="vim" heroku config:edit')}`,
        `# edit with emacs
${color.command('EDITOR="emacs" heroku config:edit')}`,
        `# edit with pico
${color.command('EDITOR="pico" heroku config:edit')}`,
        `# edit with atom editor
${color.command('VISUAL="atom --wait" heroku config:edit')}`,
    ];
    static flags = {
        app: flags.app({ required: true }),
        remote: flags.remote(),
    };
    app;
    async run() {
        const { args: { key }, flags: { app } } = await this.parse(ConfigEdit);
        this.app = app;
        ux.action.start('Fetching config');
        const original = await this.fetchLatestConfig();
        ux.action.stop();
        let newConfig = { ...original };
        const prefix = `heroku-${app}-config-`;
        const editor = EditorFactory.createEditor();
        if (key) {
            newConfig[key] = await editor.edit(original[key], { prefix });
            if (!original[key].endsWith('\n') && newConfig[key].endsWith('\n'))
                newConfig[key] = newConfig[key].slice(0, -1);
        }
        else {
            const s = await editor.edit(configToString(original), { postfix: '.sh', prefix });
            newConfig = stringToConfig(s);
        }
        if (!await this.diffPrompt(original, newConfig))
            return;
        ux.action.start('Verifying new config');
        await this.verifyUnchanged(original);
        ux.action.start('Updating config');
        removeDeleted(newConfig, original);
        await this.updateConfig(newConfig);
        ux.action.stop();
    }
    async diffPrompt(original, newConfig) {
        if (_.isEqual(original, newConfig)) {
            this.warn('no changes to config');
            return false;
        }
        ux.stdout();
        ux.stdout('Config Diff:');
        showDiff(original, newConfig);
        ux.stdout();
        return hux.confirm(`Update config on ${color.app(this.app)} with these values?`);
    }
    async fetchLatestConfig() {
        const { body: original } = await this.heroku.get(`/apps/${this.app}/config-vars`);
        return original;
    }
    async updateConfig(newConfig) {
        await this.heroku.patch(`/apps/${this.app}/config-vars`, {
            body: newConfig,
        });
    }
    async verifyUnchanged(original) {
        const latest = await this.fetchLatestConfig();
        if (!_.isEqual(original, latest)) {
            throw new Error('Config changed on server. Refusing to update.');
        }
    }
}
