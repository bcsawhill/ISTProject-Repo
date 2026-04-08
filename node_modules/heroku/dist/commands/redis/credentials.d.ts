import { Command } from '@heroku-cli/command';
export default class Credentials extends Command {
    static args: {
        database: import("@oclif/core/interfaces").Arg<string | undefined, Record<string, unknown>>;
    };
    static description: string;
    static flags: {
        app: import("@oclif/core/interfaces").OptionFlag<string, import("@oclif/core/interfaces").CustomOptions>;
        remote: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        reset: import("@oclif/core/interfaces").BooleanFlag<boolean>;
    };
    static topic: string;
    run(): Promise<void>;
}
