import { Command } from '@heroku-cli/command';
export default class Errors extends Command {
    static description: string;
    static flags: {
        app: import("@oclif/core/interfaces").OptionFlag<string, import("@oclif/core/interfaces").CustomOptions>;
        dyno: import("@oclif/core/interfaces").BooleanFlag<boolean>;
        hours: import("@oclif/core/interfaces").OptionFlag<string, import("@oclif/core/interfaces").CustomOptions>;
        json: import("@oclif/core/interfaces").BooleanFlag<boolean>;
        remote: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        router: import("@oclif/core/interfaces").BooleanFlag<boolean>;
    };
    run(): Promise<void>;
}
