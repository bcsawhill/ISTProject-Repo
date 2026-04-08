import { Command } from '@heroku-cli/command';
export default class Exec extends Command {
    static description: string;
    static examples: string[];
    static flags: {
        app: import("@oclif/core/interfaces").OptionFlag<string, import("@oclif/core/interfaces").CustomOptions>;
        dyno: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        remote: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        ssh: import("@oclif/core/interfaces").BooleanFlag<boolean>;
        status: import("@oclif/core/interfaces").BooleanFlag<boolean>;
    };
    static strict: boolean;
    static topic: string;
    run(): Promise<void>;
}
