/// <reference types="node" resolution-mode="require"/>
/// <reference types="node" resolution-mode="require"/>
import { Config } from '@oclif/core';
import fs from 'node:fs';
export declare class HerokuRepl {
    /**
     * The OClif config object containing
     * the command metadata and the means
     * to execute commands
     */
    private config;
    /**
     * The history of the REPL commands used
     */
    private history;
    /**
     * The write stream for the history file
     */
    private historyStream;
    /**
     * Processes the line received from the terminal stdin
     *
     * @param {string} input the line to process
     * @returns {Promise<void>} a promise that resolves when the command has been executed
     */
    private processLine;
    /**
     * The readline interface used for the REPL
     */
    private rl;
    /**
     * A map of key/value pairs used for
     * the 'set' and 'unset' command
     */
    private setValues;
    /**
     * Constructs a new instance of the HerokuRepl class.
     *
     * @param {Config} config The oclif core config object
     */
    constructor(config: Config);
    /**
     * Closes the REPL by closing the readline interface and history stream.
     *
     * @returns {void}
     */
    close(): void;
    /**
     * Starts the REPL by showing the prompt.
     *
     * @returns {void}
     */
    start(): void;
    /**
     * Wrapper methods for file system operations to enable testing
     */
    protected fsExistsSync(path: string): boolean;
    protected fsReadFileSync(path: string, encoding: BufferEncoding): string;
    protected fsWriteFileSync(path: string, data: string): void;
    protected fsCreateWriteStream(path: string, options: any): fs.WriteStream;
    /**
     * Build completions for a command.
     * The completions are based on the
     * metadata for the command and the
     * user input.
     *
     * @param {Record<string, unknown>} commandMeta the metadata for the command
     * @param {string[]} flagsOrArgs the flags or args for the command
     * @param {string} line the current line
     * @returns {Promise<[string[], string]>} the completions and the current input
     */
    private buildCompletions;
    /**
     * Get completions for a command.
     * The completions are based on the
     * metadata for the command and the
     * user input.
     *
     * @param {[string, string]} parts the parts for a line to get completions for
     * @returns {[string[], string]} the completions and the current input
     */
    private buildSetCompletions;
    /**
     * Capture stdout by deflecting it to a
     * trap function and returning the output.
     *
     * This is useful for silently capturing the output
     * of a command that normally prints to stdout.
     *
     * @param {CallableFunction} fn the function to capture stdout for
     * @returns {Promise<string>} the output from stdout
     */
    private captureStdout;
    /**
     * Collect inputs from the command manifest and sorts
     * them by type and then by required status.
     *
     * @param {Record<string, unknown>} commandMeta the metadata from the command manifest
     * @returns {{requiredInputs: {long: string, short: string}[], optionalInputs: {long: string, short: string}[]}} the inputs from the command manifest
     */
    private collectInputsFromManifest;
    /**
     * Creates a new readline interface.
     *
     * @returns {readline.Interface} the readline interface
     */
    private createInterface;
    /**
     * Get completions for a flag.
     *
     * @param {string} flag the flag to get the completion for
     * @param {string} startsWith the string to match against
     * @returns {Promise<[string[]]>} the completions
     */
    private getCompletion;
    /**
     * Get completions for an arg.
     *
     * @param {string} current the current input
     * @param {({long: string}[])} args the args for the command
     * @param {string[]} userArgs the args that have already been used
     * @returns {Promise<[string[], string] | null>} the completions and the current input
     */
    private getCompletionsForArg;
    /**
     * Get completions for the end of the line.
     *
     * @param {string} line the current line
     * @param {Record<string, unknown>} flags the flags for the command
     * @param {Record<string, unknown>} userFlags the flags that have already been used
     * @returns {[string[], string]} the completions and the current input
     */
    private getCompletionsForEndOfLine;
    /**
     * Get completions for a flag or flag value.
     *
     * @param {string} line the current line
     * @param {string} current the current input
     * @param {string[]} flags the flags for the command
     * @param {string[]} userFlags the flags that have already been used
     * @param {Record<string, unknown>} commandMeta the metadata for the command
     * @return {Promise<[string[], string]>} the completions and the current input
     */
    private getCompletionsForFlag;
    private isFlagValueComplete;
    /**
     * Loads the previous session state from the state file.
     * @returns {void}
     */
    private loadState;
    /**
     * Prepares the REPL history by loading
     * the previous history from the history file
     * and opening a write stream for new entries.
     *
     * @returns {Promise<void>} a promise that resolves when the history has been loaded
     */
    private prepareHistory;
    /**
     * Updates the session state based on the command and args.
     *
     * @param {'set'|'unset'} command either 'set' or 'unset'
     * @param {string[]} args an array of arg names
     * @param {boolean} omitConfirmation when false. no confirmation is printed to stdout
     * @returns {void}
     */
    private updateFlagsByName;
}
