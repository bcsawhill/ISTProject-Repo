import { Command } from '@heroku-cli/command';
export declare class ConfigGet extends Command {
    static args: {
        KEY: import("@oclif/core/interfaces").Arg<string, Record<string, unknown>>;
    };
    static description: string;
    static example: string;
    static flags: {
        app: import("@oclif/core/interfaces").OptionFlag<string, import("@oclif/core/interfaces").CustomOptions>;
        json: import("@oclif/core/interfaces").BooleanFlag<boolean>;
        remote: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        shell: import("@oclif/core/interfaces").BooleanFlag<boolean>;
    };
    static strict: boolean;
    static usage: string;
    run(): Promise<void>;
}
