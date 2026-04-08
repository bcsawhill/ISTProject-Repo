import { Command } from '@heroku-cli/command';
export default class Get extends Command {
    static aliases: string[];
    static description: string;
    static flags: {
        json: import("@oclif/core/interfaces").BooleanFlag<boolean>;
        space: import("@oclif/core/interfaces").OptionFlag<string, import("@oclif/core/interfaces").CustomOptions>;
    };
    static topic: string;
    run(): Promise<void>;
}
