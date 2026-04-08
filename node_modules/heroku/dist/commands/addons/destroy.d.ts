import { Command } from '@heroku-cli/command';
export default class Destroy extends Command {
    static args: {
        addonName: import("@oclif/core/interfaces").Arg<string, Record<string, unknown>>;
    };
    static description: string;
    static examples: string[];
    static flags: {
        app: import("@oclif/core/interfaces").OptionFlag<string, import("@oclif/core/interfaces").CustomOptions>;
        confirm: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        force: import("@oclif/core/interfaces").BooleanFlag<boolean>;
        remote: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        wait: import("@oclif/core/interfaces").BooleanFlag<boolean>;
    };
    static hiddenAliases: string[];
    static notifier: (subtitle: string, message: string, success?: boolean) => void;
    static strict: boolean;
    static topic: string;
    run(): Promise<void>;
}
