import { Command } from '@heroku-cli/command';
export default class TwoFactor extends Command {
    static aliases: string[];
    static description: string;
    run(): Promise<void>;
}
