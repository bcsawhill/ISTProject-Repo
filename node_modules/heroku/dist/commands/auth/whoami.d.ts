import { Command } from '@heroku-cli/command';
export default class AuthWhoami extends Command {
    static aliases: string[];
    static baseFlags: Record<string, any>;
    static description: string;
    static promptFlagActive: boolean;
    notloggedin(): void;
    run(): Promise<void>;
}
