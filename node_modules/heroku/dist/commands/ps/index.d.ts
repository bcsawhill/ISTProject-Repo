import { Command } from '@heroku-cli/command';
export default class Index extends Command {
    static description: string;
    static examples: string[];
    static flags: {
        app: import("@oclif/core/interfaces").OptionFlag<string, import("@oclif/core/interfaces").CustomOptions>;
        extended: import("@oclif/core/interfaces").BooleanFlag<boolean>;
        json: import("@oclif/core/interfaces").BooleanFlag<boolean>;
        remote: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
    };
    static strict: boolean;
    static topic: string;
    static usage: string;
    run(): Promise<void>;
}
