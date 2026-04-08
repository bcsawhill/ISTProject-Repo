import { Command } from '@heroku-cli/command';
export default class Add extends Command {
    static args: {
        name: import("@oclif/core/interfaces").Arg<string, Record<string, unknown>>;
    };
    static description: string;
    static example: string;
    run(): Promise<void>;
}
