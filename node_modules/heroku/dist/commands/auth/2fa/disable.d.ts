import { Command } from '@heroku-cli/command';
export default class Auth2faGenerate extends Command {
    static aliases: string[];
    static description: string;
    static example: string;
    run(): Promise<void>;
}
