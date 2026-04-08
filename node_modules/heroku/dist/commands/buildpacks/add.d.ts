import { Command } from '@heroku-cli/command';
export default class Add extends Command {
    static description: string;
    static flags: {
        app: import("@oclif/core/interfaces").OptionFlag<string, import("@oclif/core/interfaces").CustomOptions>;
        remote: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        index: import("@oclif/core/interfaces").OptionFlag<number | undefined, import("@oclif/core/interfaces").CustomOptions>;
    };
    static args: {
        buildpack: import("@oclif/core/interfaces").Arg<string, Record<string, unknown>>;
    };
    run(): Promise<void>;
}
