import { Command } from '@heroku-cli/command';
export default class Versions extends Command {
    static description: string;
    static args: {
        buildpack: import("@oclif/core/interfaces").Arg<string, Record<string, unknown>>;
    };
    run(): Promise<void>;
}
