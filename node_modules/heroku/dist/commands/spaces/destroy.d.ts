import { Command } from '@heroku-cli/command';
export default class Destroy extends Command {
    static args: {
        space: import("@oclif/core/interfaces").Arg<string | undefined, Record<string, unknown>>;
    };
    static description: string;
    static examples: string[];
    static flags: {
        confirm: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        space: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
    };
    static topic: string;
    run(): Promise<void>;
}
