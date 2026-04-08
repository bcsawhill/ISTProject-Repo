import BaseCommand from '../../../lib/data/baseCommand.js';
export default class DataMaintenancesHistory extends BaseCommand {
    static args: {
        addon: import("@oclif/core/interfaces").Arg<string, Record<string, unknown>>;
    };
    static description: string;
    static examples: string[];
    static flags: {
        app: import("@oclif/core/interfaces").OptionFlag<string, import("@oclif/core/interfaces").CustomOptions>;
        columns: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        csv: import("@oclif/core/interfaces").BooleanFlag<boolean>;
        filter: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        json: import("@oclif/core/interfaces").BooleanFlag<boolean>;
        num: import("@oclif/core/interfaces").OptionFlag<string, import("@oclif/core/interfaces").CustomOptions>;
        remote: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        sort: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
    };
    run(): Promise<void>;
}
