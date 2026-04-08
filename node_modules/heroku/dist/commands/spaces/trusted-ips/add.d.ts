import { Command } from '@heroku-cli/command';
export default class Add extends Command {
    static args: {
        source: import("@oclif/core/interfaces").Arg<string, Record<string, unknown>>;
    };
    static description: string;
    static examples: string[];
    static flags: {
        confirm: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        space: import("@oclif/core/interfaces").OptionFlag<string, import("@oclif/core/interfaces").CustomOptions>;
    };
    static hiddenAliases: string[];
    static topic: string;
    run(): Promise<void>;
    private isUniqueRule;
}
