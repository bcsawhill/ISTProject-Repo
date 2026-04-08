import { Command } from '@heroku-cli/command';
export default class AppsRename extends Command {
    static args: {
        newname: import("@oclif/core/interfaces").Arg<string, Record<string, unknown>>;
    };
    static description: string;
    static examples: string[];
    static flags: {
        app: import("@oclif/core/interfaces").OptionFlag<string, import("@oclif/core/interfaces").CustomOptions>;
        remote: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
    };
    static help: string;
    static hiddenAliases: string[];
    static topic: string;
    run(): Promise<void>;
}
