import { Command } from '@heroku-cli/command';
export default class AccountsIndex extends Command {
    static baseFlags: Record<string, any>;
    static description: string;
    static example: string;
    static promptFlagActive: boolean;
    run(): Promise<void>;
}
