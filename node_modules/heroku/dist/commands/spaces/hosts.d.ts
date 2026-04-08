import { Command } from '@heroku-cli/command';
export default class Hosts extends Command {
    static topic: string;
    static hidden: boolean;
    static description: string;
    static flags: {
        space: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        json: import("@oclif/core/interfaces").BooleanFlag<boolean>;
    };
    static args: {
        space: import("@oclif/core/interfaces").Arg<string | undefined, Record<string, unknown>>;
    };
    run(): Promise<void>;
}
