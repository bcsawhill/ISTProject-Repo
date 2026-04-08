import BaseCommand from '../../../../lib/data/baseCommand.js';
export default class DataMaintenancesWindowUpdate extends BaseCommand {
    static args: {
        addon: import("@oclif/core/interfaces").Arg<string, Record<string, unknown>>;
        day_of_week: import("@oclif/core/interfaces").Arg<string, Record<string, unknown>>;
        time_of_day: import("@oclif/core/interfaces").Arg<string, Record<string, unknown>>;
    };
    static description: string;
    static examples: string[];
    static flags: {
        app: import("@oclif/core/interfaces").OptionFlag<string, import("@oclif/core/interfaces").CustomOptions>;
        json: import("@oclif/core/interfaces").BooleanFlag<boolean>;
        remote: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
    };
    run(): Promise<void>;
}
