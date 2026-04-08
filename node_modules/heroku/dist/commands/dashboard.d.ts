import { Command } from '@heroku-cli/command';
export default class Dashboard extends Command {
    static baseFlags: Record<string, any>;
    static description: string;
    static hidden: boolean;
    static promptFlagActive: boolean;
    static topic: string;
    run(): Promise<void>;
}
