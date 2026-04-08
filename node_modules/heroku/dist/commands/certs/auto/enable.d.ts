import { Command } from '@heroku-cli/command';
export default class Enable extends Command {
    static description: string;
    static flags: {
        app: import("@oclif/core/interfaces").OptionFlag<string, import("@oclif/core/interfaces").CustomOptions>;
        remote: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        wait: import("@oclif/core/interfaces").BooleanFlag<boolean>;
    };
    static notifier: (subtitle: string, message: string, success?: boolean) => void;
    static topic: string;
    run(): Promise<void>;
}
