import { Command } from '@heroku-cli/command';
export default class AuthorizationsRevoke extends Command {
    static aliases: string[];
    static args: {
        id: import("@oclif/core/interfaces").Arg<string, Record<string, unknown>>;
    };
    static description: string;
    static examples: string[];
    run(): Promise<void>;
}
