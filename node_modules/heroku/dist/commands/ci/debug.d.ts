import { Command } from '@heroku-cli/command';
export default class Debug extends Command {
    static description: string;
    static help: string;
    static flags: {
        app: import("@oclif/core/interfaces").OptionFlag<string, import("@oclif/core/interfaces").CustomOptions>;
        'no-cache': import("@oclif/core/interfaces").BooleanFlag<boolean>;
        'no-setup': import("@oclif/core/interfaces").BooleanFlag<boolean>;
        pipeline: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
    };
    static topic: string;
    run(): Promise<void>;
}
