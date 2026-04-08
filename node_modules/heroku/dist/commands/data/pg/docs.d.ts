import BaseCommand from '../../../lib/data/baseCommand.js';
export default class DataPgDocs extends BaseCommand {
    static defaultUrl: string;
    static description: string;
    static flags: {
        browser: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
    };
    openUrl(url: string, browser: string, description: string): Promise<void>;
    run(): Promise<void>;
}
