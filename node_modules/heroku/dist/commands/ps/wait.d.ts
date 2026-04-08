import { Command } from '@heroku-cli/command';
export default class Wait extends Command {
    static description: string;
    static flags: {
        app: import("@oclif/core/interfaces").OptionFlag<string, import("@oclif/core/interfaces").CustomOptions>;
        remote: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        type: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        'wait-interval': import("@oclif/core/interfaces").OptionFlag<number, import("@oclif/core/interfaces").CustomOptions>;
        'with-run': import("@oclif/core/interfaces").BooleanFlag<boolean>;
    };
    static topic: string;
    run(): Promise<void>;
}
