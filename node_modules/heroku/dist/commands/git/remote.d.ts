import { Command } from '@heroku-cli/command';
export declare class GitRemote extends Command {
    static description: string;
    static example: string;
    static flags: {
        app: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        remote: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
    };
    static strict: boolean;
    run(): Promise<void>;
}
