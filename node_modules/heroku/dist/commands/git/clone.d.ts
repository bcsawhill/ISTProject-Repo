import { Command } from '@heroku-cli/command';
export declare class GitClone extends Command {
    static args: {
        DIRECTORY: import("@oclif/core/interfaces").Arg<string | undefined, Record<string, unknown>>;
    };
    static description: string;
    static example: string;
    static flags: {
        app: import("@oclif/core/interfaces").OptionFlag<string, import("@oclif/core/interfaces").CustomOptions>;
        remote: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
    };
    run(): Promise<void>;
}
