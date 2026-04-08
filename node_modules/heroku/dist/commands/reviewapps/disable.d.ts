import { Command } from '@heroku-cli/command';
export default class ReviewappsDisable extends Command {
    static description: string;
    static examples: string[];
    static flags: {
        app: import("@oclif/core/interfaces").OptionFlag<string, import("@oclif/core/interfaces").CustomOptions>;
        autodeploy: import("@oclif/core/interfaces").BooleanFlag<boolean>;
        autodestroy: import("@oclif/core/interfaces").BooleanFlag<boolean>;
        'no-autodeploy': import("@oclif/core/interfaces").BooleanFlag<boolean>;
        'no-autodestroy': import("@oclif/core/interfaces").BooleanFlag<boolean>;
        'no-wait-for-ci': import("@oclif/core/interfaces").BooleanFlag<boolean>;
        pipeline: import("@oclif/core/interfaces").OptionFlag<string, import("@oclif/core/interfaces").CustomOptions>;
        remote: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        'wait-for-ci': import("@oclif/core/interfaces").BooleanFlag<boolean>;
    };
    run(): Promise<void>;
}
