import { Command } from '@heroku-cli/command';
export default class Transfer extends Command {
    static description: string;
    static examples: string[];
    static flags: {
        space: import("@oclif/core/interfaces").OptionFlag<string, import("@oclif/core/interfaces").CustomOptions>;
        team: import("@oclif/core/interfaces").OptionFlag<string, import("@oclif/core/interfaces").CustomOptions>;
    };
    static topic: string;
    run(): Promise<void>;
}
