import { Command } from '@heroku-cli/command';
export default class PipelinesInfo extends Command {
    static args: {
        pipeline: import("@oclif/core/interfaces").Arg<string, Record<string, unknown>>;
    };
    static description: string;
    static examples: string[];
    static flags: {
        json: import("@oclif/core/interfaces").BooleanFlag<boolean>;
        'with-owners': import("@oclif/core/interfaces").BooleanFlag<boolean>;
    };
    run(): Promise<void>;
}
