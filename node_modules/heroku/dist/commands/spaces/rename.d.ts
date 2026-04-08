import { Command } from '@heroku-cli/command';
export default class Rename extends Command {
    static description: string;
    static example: string;
    static flags: {
        from: import("@oclif/core/interfaces").OptionFlag<string, import("@oclif/core/interfaces").CustomOptions>;
        to: import("@oclif/core/interfaces").OptionFlag<string, import("@oclif/core/interfaces").CustomOptions>;
    };
    static topic: string;
    run(): Promise<void>;
}
