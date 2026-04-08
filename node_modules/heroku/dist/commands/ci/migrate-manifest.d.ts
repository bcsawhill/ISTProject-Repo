import { Command } from '@heroku-cli/command';
export default class CiMigrateManifest extends Command {
    static baseFlags: Record<string, any>;
    static description: string;
    static examples: string[];
    static promptFlagActive: boolean;
    static topic: string;
    run(): Promise<void>;
}
