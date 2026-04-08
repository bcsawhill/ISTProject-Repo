import { Command } from '@heroku-cli/command';
export default class Update extends Command {
    static args: {
        CRT: import("@oclif/core/interfaces").Arg<string, Record<string, unknown>>;
        KEY: import("@oclif/core/interfaces").Arg<string, Record<string, unknown>>;
    };
    static description: string;
    static examples: string[];
    static flags: {
        app: import("@oclif/core/interfaces").OptionFlag<string, import("@oclif/core/interfaces").CustomOptions>;
        confirm: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        endpoint: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        name: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        remote: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
    };
    static topic: string;
    run(): Promise<void>;
}
