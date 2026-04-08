import { Command } from '@heroku-cli/command';
export default class Diagnose extends Command {
    static topic: string;
    static description: string;
    static flags: {
        json: import("@oclif/core/interfaces").BooleanFlag<boolean>;
        app: import("@oclif/core/interfaces").OptionFlag<string, import("@oclif/core/interfaces").CustomOptions>;
        remote: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
    };
    static args: {
        'DATABASE|REPORT_ID': import("@oclif/core/interfaces").Arg<string | undefined, Record<string, unknown>>;
    };
    run(): Promise<void>;
    private displayReport;
    private display;
    private generateParams;
    private generateReport;
}
