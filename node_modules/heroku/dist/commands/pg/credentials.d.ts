import { Command } from '@heroku-cli/command';
import type { NonAdvancedCredentialInfo } from '../../lib/data/types.js';
export default class Credentials extends Command {
    static args: {
        database: import("@oclif/core/interfaces").Arg<string | undefined, Record<string, unknown>>;
    };
    static description: string;
    static flags: {
        app: import("@oclif/core/interfaces").OptionFlag<string, import("@oclif/core/interfaces").CustomOptions>;
        remote: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
    };
    static topic: string;
    protected isDefaultCredential(cred: NonAdvancedCredentialInfo): boolean;
    run(): Promise<void>;
    protected sortByDefaultAndName(credentials: NonAdvancedCredentialInfo[]): NonAdvancedCredentialInfo[];
}
