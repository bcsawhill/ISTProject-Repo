import { Command } from '@heroku-cli/command';
export default class AppsDiff extends Command {
    static args: {
        app1: import("@oclif/core/interfaces").Arg<string, Record<string, unknown>>;
        app2: import("@oclif/core/interfaces").Arg<string, Record<string, unknown>>;
    };
    static description: string;
    static help: string;
    static topic: string;
    run(): Promise<void>;
}
