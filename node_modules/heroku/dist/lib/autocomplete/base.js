import { Command } from '@heroku-cli/command';
import fs from 'fs-extra';
import * as path from 'path';
import { CompletionLookup } from './completions.js';
export class AutocompleteBase extends Command {
    get acLogfilePath() {
        return path.join(this.config.cacheDir, 'autocomplete.log');
    }
    get autocompleteCacheDir() {
        return path.join(this.config.cacheDir, 'autocomplete');
    }
    get completionsCacheDir() {
        return path.join(this.config.cacheDir, 'autocomplete', 'completions');
    }
    errorIfNotSupportedShell(shell) {
        if (!shell) {
            this.error('Missing required argument shell');
        }
        this.errorIfWindows();
        if (!['bash', 'zsh'].includes(shell)) {
            throw new Error(`${shell} is not a supported shell for autocomplete`);
        }
    }
    errorIfWindows() {
        if (this.config.windows) {
            throw new Error('Autocomplete is not currently supported in Windows');
        }
    }
    findCompletion(cmdId, name, description = '') {
        return new CompletionLookup(cmdId, name, description).run();
    }
    async writeLogFile(msg) {
        const now = new Date();
        const entry = `[${now}] ${msg}\n`;
        await fs.appendFile(this.acLogfilePath, entry);
    }
}
