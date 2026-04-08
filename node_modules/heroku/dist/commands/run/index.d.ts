import { Command } from '@heroku-cli/command';
export default class Run extends Command {
    static description: string;
    static examples: string[];
    static flags: {
        app: import("@oclif/core/interfaces").OptionFlag<string, import("@oclif/core/interfaces").CustomOptions>;
        env: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        'exit-code': import("@oclif/core/interfaces").BooleanFlag<boolean>;
        listen: import("@oclif/core/interfaces").BooleanFlag<boolean>;
        'no-launcher': import("@oclif/core/interfaces").BooleanFlag<boolean>;
        'no-notify': import("@oclif/core/interfaces").BooleanFlag<boolean>;
        'no-tty': import("@oclif/core/interfaces").BooleanFlag<boolean>;
        remote: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        size: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        type: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
    };
    static strict: boolean;
    run(): Promise<void>;
}
