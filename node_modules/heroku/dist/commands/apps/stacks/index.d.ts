import { Command } from '@heroku-cli/command';
export default class StacksIndex extends Command {
    static description: string;
    static flags: {
        app: import("@oclif/core/interfaces").OptionFlag<string, import("@oclif/core/interfaces").CustomOptions>;
        remote: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
    };
    static hiddenAliases: string[];
    static topic: string;
    run(): Promise<void>;
}
