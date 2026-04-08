import { Command } from '@heroku-cli/command';
export default class Info extends Command {
    static args: {
        name: import("@oclif/core/interfaces").Arg<string, Record<string, unknown>>;
    };
    static description: string;
    static example: string;
    static flags: {
        json: import("@oclif/core/interfaces").BooleanFlag<boolean>;
        space: import("@oclif/core/interfaces").OptionFlag<string, import("@oclif/core/interfaces").CustomOptions>;
    };
    static topic: string;
    run(): Promise<void>;
    private displayVPNInfo;
    private render;
}
