import { AutocompleteBase } from '../../lib/autocomplete/base.js';
export default class Options extends AutocompleteBase {
    static hidden: boolean;
    static description: string;
    static flags: {
        app: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
    };
    static args: {
        completion: import("@oclif/core/interfaces").Arg<string | undefined, Record<string, unknown>>;
    };
    parsedArgs: {
        [name: string]: string;
    };
    parsedFlags: {
        [name: string]: string;
    };
    run(): Promise<void>;
    private processCommandLine;
    private determineCompletion;
    private fetchOptions;
    private parsedFlagsWithEnvVars;
    private throwError;
    private findFlagFromWildArg;
    private determineCmdState;
}
