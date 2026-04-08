import { Command } from '@heroku-cli/command';
export default class Open extends Command {
    static args: {
        pipeline: import("@oclif/core/interfaces").Arg<string, Record<string, unknown>>;
    };
    static description: string;
    static examples: string[];
    run(): Promise<void>;
}
