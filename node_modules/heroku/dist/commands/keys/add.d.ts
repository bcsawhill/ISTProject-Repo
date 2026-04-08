import { Command } from '@heroku-cli/command';
export default class Add extends Command {
    static args: {
        key: import("@oclif/core/interfaces").Arg<string | undefined, Record<string, unknown>>;
    };
    static description: string;
    static example: string;
    static flags: {
        quiet: import("@oclif/core/interfaces").BooleanFlag<boolean>;
        yes: import("@oclif/core/interfaces").BooleanFlag<boolean>;
    };
    run(): Promise<void>;
}
