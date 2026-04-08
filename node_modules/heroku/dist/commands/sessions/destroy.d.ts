import { Command } from '@heroku-cli/command';
export default class SessionsDestroy extends Command {
    static args: {
        id: import("@oclif/core/interfaces").Arg<string, Record<string, unknown>>;
    };
    static description: string;
    run(): Promise<void>;
}
