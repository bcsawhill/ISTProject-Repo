import { Command } from '@heroku-cli/command';
export default class Clear extends Command {
    static baseFlags: Record<string, any>;
    static description: string;
    static promptFlagActive: boolean;
    run(): Promise<void>;
}
