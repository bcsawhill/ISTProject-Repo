import { Command } from '@heroku-cli/command';
export default class CiConfigGet extends Command {
    static args: {
        key: import("@oclif/core/interfaces").Arg<string, Record<string, unknown>>;
    };
    static description: string;
    static examples: string[];
    static flags: {
        app: import("@oclif/core/interfaces").OptionFlag<string, import("@oclif/core/interfaces").CustomOptions>;
        pipeline: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        remote: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        shell: import("@oclif/core/interfaces").BooleanFlag<boolean>;
    };
    static topic: string;
    run(): Promise<void>;
}
