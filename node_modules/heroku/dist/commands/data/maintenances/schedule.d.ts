import * as Heroku from '@heroku-cli/schema';
import BaseCommand from '../../../lib/data/baseCommand.js';
export default class DataMaintenancesSchedule extends BaseCommand {
    static args: {
        addon: import("@oclif/core/interfaces").Arg<string, Record<string, unknown>>;
    };
    static description: string;
    static examples: string[];
    static flags: {
        app: import("@oclif/core/interfaces").OptionFlag<string, import("@oclif/core/interfaces").CustomOptions>;
        remote: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        week: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        weeks: import("@oclif/core/interfaces").OptionFlag<string, import("@oclif/core/interfaces").CustomOptions>;
    };
    protected computeDelayWeeks(addon: Heroku.AddOn, week: string): Promise<string>;
    run(): Promise<void>;
    protected scheduleMaintenance(addon: Heroku.AddOn, delayWeeks: string): Promise<void>;
}
