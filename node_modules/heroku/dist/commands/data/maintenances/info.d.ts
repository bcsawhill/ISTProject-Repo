import BaseCommand from '../../../lib/data/baseCommand.js';
import { Maintenance } from '../../../lib/data/types.js';
interface StyledMaintenance extends Maintenance {
    [key: string]: any;
    duration_approximate?: string;
}
export default class DataMaintenancesInfo extends BaseCommand {
    static args: {
        addon: import("@oclif/core/interfaces").Arg<string, Record<string, unknown>>;
    };
    static description: string;
    static examples: string[];
    static flags: {
        app: import("@oclif/core/interfaces").OptionFlag<string, import("@oclif/core/interfaces").CustomOptions>;
        json: import("@oclif/core/interfaces").BooleanFlag<boolean>;
        remote: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
    };
    protected createStyledMaintenance(maintenance: Maintenance): StyledMaintenance;
    run(): Promise<void>;
}
export {};
