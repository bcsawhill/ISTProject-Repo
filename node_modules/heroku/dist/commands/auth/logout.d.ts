import { Command } from '@heroku-cli/command';
export default class Logout extends Command {
    static aliases: string[];
    static baseFlags: Record<string, any>;
    static description: string;
    static promptFlagActive: boolean;
    run(): Promise<void>;
}
