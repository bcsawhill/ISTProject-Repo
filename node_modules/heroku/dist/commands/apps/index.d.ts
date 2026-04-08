import { Command } from '@heroku-cli/command';
export default class AppsIndex extends Command {
    static description: string;
    static examples: string[];
    static flags: {
        all: import("@oclif/core/interfaces").BooleanFlag<boolean>;
        'internal-routing': import("@oclif/core/interfaces").BooleanFlag<boolean>;
        json: import("@oclif/core/interfaces").BooleanFlag<boolean>;
        personal: import("@oclif/core/interfaces").BooleanFlag<boolean>;
        space: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        team: import("@oclif/core/interfaces").OptionFlag<string, import("@oclif/core/interfaces").CustomOptions>;
    };
    static hiddenAliases: string[];
    static topic: string;
    run(): Promise<void>;
}
