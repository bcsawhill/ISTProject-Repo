import { APIClient, Command } from '@heroku-cli/command';
import inquirer from 'inquirer';
import { SniEndpoint } from '../../lib/types/sni_endpoint.js';
export default class Add extends Command {
    static args: {
        CRT: import("@oclif/core/interfaces").Arg<string, Record<string, unknown>>;
        KEY: import("@oclif/core/interfaces").Arg<string, Record<string, unknown>>;
    };
    static description: string;
    static examples: string[];
    static flags: {
        app: import("@oclif/core/interfaces").OptionFlag<string, import("@oclif/core/interfaces").CustomOptions>;
        remote: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
    };
    static strict: boolean;
    static topic: string;
    configureDomains(app: string, heroku: APIClient, cert: SniEndpoint): Promise<void>;
    getDomainsToAssociate(sniEndpoint: SniEndpoint): Promise<{
        domains: string[];
    }> & {
        ui: inquirer.ui.Prompt<{
            domains: string[];
        }>;
    };
    run(): Promise<void>;
    selectDomains(domainOptions: string[]): Promise<{
        domains: string[];
    }>;
}
