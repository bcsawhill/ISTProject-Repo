import { Command } from '@heroku-cli/command';
export declare class GitCredentials extends Command {
    static hidden: boolean;
    static description: string;
    static args: {
        command: import("@oclif/core/interfaces").Arg<string, Record<string, unknown>>;
    };
    run(): Promise<void>;
}
