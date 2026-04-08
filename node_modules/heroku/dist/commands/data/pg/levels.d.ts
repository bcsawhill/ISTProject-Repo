import BaseCommand from '../../../lib/data/baseCommand.js';
export default class DataPgLevels extends BaseCommand {
    static baseFlags: Record<string, any>;
    static description: string;
    static promptFlagActive: boolean;
    run(): Promise<void>;
}
