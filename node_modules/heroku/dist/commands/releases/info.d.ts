import { Command } from '@heroku-cli/command';
export default class Info extends Command {
    static args: {
        release: import("@oclif/core/interfaces").Arg<string | undefined, Record<string, unknown>>;
    };
    static description: string;
    static flags: {
        app: import("@oclif/core/interfaces").OptionFlag<string, import("@oclif/core/interfaces").CustomOptions>;
        json: import("@oclif/core/interfaces").BooleanFlag<boolean>;
        remote: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        shell: import("@oclif/core/interfaces").BooleanFlag<boolean>;
    };
    static topic: string;
    run(): Promise<void>;
}
