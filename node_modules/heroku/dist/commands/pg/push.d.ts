import { Command } from '@heroku-cli/command';
import { pg } from '@heroku/heroku-cli-util';
export default class Push extends Command {
    static args: {
        source: import("@oclif/core/interfaces").Arg<string, Record<string, unknown>>;
        target: import("@oclif/core/interfaces").Arg<string, Record<string, unknown>>;
    };
    static description: string;
    static examples: string[];
    static flags: {
        app: import("@oclif/core/interfaces").OptionFlag<string, import("@oclif/core/interfaces").CustomOptions>;
        'exclude-table-data': import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        remote: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
    };
    static topic: string;
    protected push(sourceIn: pg.ConnectionDetails, targetIn: pg.ConnectionDetails, exclusions: string[]): Promise<void>;
    run(): Promise<void>;
}
