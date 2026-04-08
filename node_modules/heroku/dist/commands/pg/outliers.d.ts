import { Command } from '@heroku-cli/command';
export default class Outliers extends Command {
    static topic: string;
    static description: string;
    static flags: {
        reset: import("@oclif/core/interfaces").BooleanFlag<boolean>;
        truncate: import("@oclif/core/interfaces").BooleanFlag<boolean>;
        num: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        app: import("@oclif/core/interfaces").OptionFlag<string, import("@oclif/core/interfaces").CustomOptions>;
        remote: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
    };
    static args: {
        database: import("@oclif/core/interfaces").Arg<string | undefined, Record<string, unknown>>;
    };
    private psqlService;
    run(): Promise<void>;
    protected ensurePGStatStatement(): Promise<void>;
    protected outliersQuery(version: string | undefined, limit: number, truncate: boolean): string;
}
