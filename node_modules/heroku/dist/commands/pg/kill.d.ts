import { Command } from '@heroku-cli/command';
export default class Kill extends Command {
    static topic: string;
    static description: string;
    static flags: {
        force: import("@oclif/core/interfaces").BooleanFlag<boolean>;
        app: import("@oclif/core/interfaces").OptionFlag<string, import("@oclif/core/interfaces").CustomOptions>;
        remote: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
    };
    static args: {
        pid: import("@oclif/core/interfaces").Arg<string, Record<string, unknown>>;
        database: import("@oclif/core/interfaces").Arg<string | undefined, Record<string, unknown>>;
    };
    run(): Promise<void>;
}
