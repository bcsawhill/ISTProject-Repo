import { Command } from '@heroku-cli/command';
export default class Docs extends Command {
    static args: {
        addon: import("@oclif/core/interfaces").Arg<string, Record<string, unknown>>;
    };
    static description: string;
    static flags: {
        app: import("@oclif/core/interfaces").OptionFlag<string, import("@oclif/core/interfaces").CustomOptions>;
        remote: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        'show-url': import("@oclif/core/interfaces").BooleanFlag<boolean>;
    };
    static topic: string;
    static urlOpener: (url: string) => Promise<unknown>;
    run(): Promise<void>;
}
