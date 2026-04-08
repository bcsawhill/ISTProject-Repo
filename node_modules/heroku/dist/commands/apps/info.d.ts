import { Command } from '@heroku-cli/command';
export default class AppsInfo extends Command {
    static args: {
        app: import("@oclif/core/interfaces").Arg<string | undefined, Record<string, unknown>>;
    };
    static description: string;
    static examples: string[];
    static flags: {
        app: import("@oclif/core/interfaces").OptionFlag<string, import("@oclif/core/interfaces").CustomOptions>;
        extended: import("@oclif/core/interfaces").BooleanFlag<boolean>;
        json: import("@oclif/core/interfaces").BooleanFlag<boolean>;
        remote: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        shell: import("@oclif/core/interfaces").BooleanFlag<boolean>;
    };
    static help: string;
    static hiddenAliases: string[];
    static topic: string;
    run(): Promise<void>;
}
