import { Command } from '@heroku-cli/command';
export default class Accept extends Command {
    static args: {
        pcxid: import("@oclif/core/interfaces").Arg<string | undefined, Record<string, unknown>>;
        space: import("@oclif/core/interfaces").Arg<string | undefined, Record<string, unknown>>;
    };
    static description: string;
    static examples: string[];
    static flags: {
        pcxid: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        space: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
    };
    static topic: string;
    run(): Promise<void>;
}
