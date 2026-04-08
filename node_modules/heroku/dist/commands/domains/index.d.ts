import { Command } from '@heroku-cli/command';
import * as Heroku from '@heroku-cli/schema';
export default class DomainsIndex extends Command {
    static description: string;
    static examples: string[];
    static flags: {
        app: import("@oclif/core/interfaces").OptionFlag<string, import("@oclif/core/interfaces").CustomOptions>;
        columns: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        csv: import("@oclif/core/interfaces").BooleanFlag<boolean>;
        extended: import("@oclif/core/interfaces").BooleanFlag<boolean>;
        filter: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        json: import("@oclif/core/interfaces").BooleanFlag<boolean>;
        remote: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        sort: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
    };
    getFilteredDomains: (filterKeyValue: string, domains: Array<Heroku.Domain>) => {
        filteredDomains: Heroku.Domain[];
        size: number;
    };
    mapColumnHeadersToKeys: (columnHeaders: string[]) => string[];
    mapSortFieldToProperty: (sortField: string) => string;
    outputCSV: (customDomains: Heroku.Domain[], tableConfig: Record<string, any>, sortProperty?: string) => void;
    tableConfig: (needsEndpoints: boolean, extended: boolean, requestedColumns?: string[]) => Record<string, any>;
    confirmDisplayAllDomains(customDomains: Heroku.Domain[]): Promise<any>;
    run(): Promise<void>;
}
