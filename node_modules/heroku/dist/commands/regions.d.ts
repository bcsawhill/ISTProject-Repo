import { Command } from '@heroku-cli/command';
export default class Regions extends Command {
    static description: string;
    static flags: {
        common: import("@oclif/core/interfaces").BooleanFlag<boolean>;
        json: import("@oclif/core/interfaces").BooleanFlag<boolean>;
        private: import("@oclif/core/interfaces").BooleanFlag<boolean>;
    };
    static topic: string;
    run(): Promise<void>;
}
