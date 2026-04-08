import { Command } from '@heroku-cli/command';
export default class Copy extends Command {
    static args: {
        source: import("@oclif/core/interfaces").Arg<string, Record<string, unknown>>;
        target: import("@oclif/core/interfaces").Arg<string, Record<string, unknown>>;
    };
    static description: string;
    static flags: {
        app: import("@oclif/core/interfaces").OptionFlag<string, import("@oclif/core/interfaces").CustomOptions>;
        confirm: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        remote: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        verbose: import("@oclif/core/interfaces").BooleanFlag<boolean>;
        'wait-interval': import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
    };
    static help: string;
    static topic: string;
    run(): Promise<void>;
}
