import { Command } from '@heroku-cli/command';
export default class Retry extends Command {
    static description: string;
    static examples: string[];
    static flags: {
        app: import("@oclif/core/interfaces").OptionFlag<string, import("@oclif/core/interfaces").CustomOptions>;
    };
    static help: string;
    static topic: string;
    run(): Promise<void>;
}
