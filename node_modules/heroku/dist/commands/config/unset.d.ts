import { Command } from '@heroku-cli/command';
export declare class ConfigUnset extends Command {
    static aliases: string[];
    static description: string;
    static examples: string[];
    static flags: {
        app: import("@oclif/core/interfaces").OptionFlag<string, import("@oclif/core/interfaces").CustomOptions>;
        remote: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
    };
    static strict: boolean;
    run(): Promise<void>;
}
