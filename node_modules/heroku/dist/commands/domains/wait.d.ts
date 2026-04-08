import { Command } from '@heroku-cli/command';
export default class DomainsWait extends Command {
    static description: string;
    static flags: {
        app: import("@oclif/core/interfaces").OptionFlag<string, import("@oclif/core/interfaces").CustomOptions>;
        remote: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
    };
    static args: {
        hostname: import("@oclif/core/interfaces").Arg<string | undefined, Record<string, unknown>>;
    };
    run(): Promise<void>;
}
