import { Command } from '@heroku-cli/command';
export default class AuthorizationsRotate extends Command {
    static description: string;
    static args: {
        id: import("@oclif/core/interfaces").Arg<string, Record<string, unknown>>;
    };
    run(): Promise<void>;
}
