import { Command } from '@heroku-cli/command';
export default class Login extends Command {
    static aliases: string[];
    static description: string;
    static flags: {
        browser: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        'expires-in': import("@oclif/core/interfaces").OptionFlag<number | undefined, import("@oclif/core/interfaces").CustomOptions>;
        interactive: import("@oclif/core/interfaces").BooleanFlag<boolean>;
        sso: import("@oclif/core/interfaces").BooleanFlag<boolean>;
    };
    run(): Promise<void>;
}
