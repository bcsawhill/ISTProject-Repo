import { Command } from '@heroku-cli/command';
export default class Restore extends Command {
    static args: {
        backup: import("@oclif/core/interfaces").Arg<string | undefined, Record<string, unknown>>;
        database: import("@oclif/core/interfaces").Arg<string | undefined, Record<string, unknown>>;
    };
    static description: string;
    static examples: string[];
    static flags: {
        app: import("@oclif/core/interfaces").OptionFlag<string, import("@oclif/core/interfaces").CustomOptions>;
        confirm: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        extensions: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        remote: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        verbose: import("@oclif/core/interfaces").BooleanFlag<boolean>;
        'wait-interval': import("@oclif/core/interfaces").OptionFlag<number, import("@oclif/core/interfaces").CustomOptions>;
    };
    static topic: string;
    protected getSortedExtensions(extensions: null | string | undefined): string[] | undefined;
    run(): Promise<void>;
}
