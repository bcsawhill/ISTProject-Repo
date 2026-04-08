import { Command } from '@heroku-cli/command';
export default class Rename extends Command {
    static args: {
        addon_name: import("@oclif/core/interfaces").Arg<string, Record<string, unknown>>;
        new_name: import("@oclif/core/interfaces").Arg<string, Record<string, unknown>>;
    };
    static description: string;
    static topic: string;
    run(): Promise<void>;
}
