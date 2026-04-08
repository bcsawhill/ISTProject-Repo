import { Command } from '@heroku-cli/command';
export default class Scale extends Command {
    static aliases: string[];
    static description: string;
    static examples: string[];
    static flags: {
        app: import("@oclif/core/interfaces").OptionFlag<string, import("@oclif/core/interfaces").CustomOptions>;
        remote: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
    };
    static hiddenAliases: string[];
    static strict: boolean;
    run(): Promise<void>;
}
