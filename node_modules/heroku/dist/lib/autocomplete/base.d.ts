import { Command } from '@heroku-cli/command';
import type { Completion } from '../types/completion.js';
export declare abstract class AutocompleteBase extends Command {
    get acLogfilePath(): string;
    get autocompleteCacheDir(): string;
    get completionsCacheDir(): string;
    errorIfNotSupportedShell(shell: string): void;
    errorIfWindows(): void;
    protected findCompletion(cmdId: string, name: string, description?: string): Completion | undefined;
    writeLogFile(msg: string): Promise<void>;
}
