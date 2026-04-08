import { Command } from '@heroku-cli/command';
export default class Set extends Command {
    static description: 'set new app buildpack, overwriting into list of buildpacks if necessary';
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
