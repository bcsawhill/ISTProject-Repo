import * as Heroku from '@heroku-cli/schema';
import BaseCommand from '../../../lib/data/baseCommand.js';
export default class DataMaintenancesRun extends BaseCommand {
    static args: {
        addon: import("@oclif/core/interfaces").Arg<string, Record<string, unknown>>;
    };
    static description: string;
    static examples: string[];
    static flags: {
        app: import("@oclif/core/interfaces").OptionFlag<string, import("@oclif/core/interfaces").CustomOptions>;
        confirm: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        force: import("@oclif/core/interfaces").BooleanFlag<boolean>;
        remote: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        wait: import("@oclif/core/interfaces").BooleanFlag<boolean>;
    };
    confirmMaintenanceMode(addon: Heroku.AddOn, confirm: string | undefined, force: boolean): Promise<void>;
    run(): Promise<void>;
}
