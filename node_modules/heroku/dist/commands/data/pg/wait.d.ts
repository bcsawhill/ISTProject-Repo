import BaseCommand from '../../../lib/data/baseCommand.js';
import notify from '../../../lib/notify.js';
export default class DataPgWait extends BaseCommand {
    static args: {
        database: import("@oclif/core/interfaces").Arg<string, Record<string, unknown>>;
    };
    static description: string;
    static examples: string[];
    static flags: {
        app: import("@oclif/core/interfaces").OptionFlag<string, import("@oclif/core/interfaces").CustomOptions>;
        'no-notify': import("@oclif/core/interfaces").BooleanFlag<boolean>;
        remote: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        'wait-interval': import("@oclif/core/interfaces").OptionFlag<number, import("@oclif/core/interfaces").CustomOptions>;
    };
    notify(...args: Parameters<typeof notify>): Promise<void>;
    run(): Promise<void>;
    wait(ms: number): Promise<void>;
    private waitFor;
}
