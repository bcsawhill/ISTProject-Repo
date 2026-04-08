import { Command } from '@heroku-cli/command';
export default class UsageAddons extends Command {
    static description: string;
    static flags: {
        app: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        team: import("@oclif/core/interfaces").OptionFlag<string, import("@oclif/core/interfaces").CustomOptions>;
    };
    static topic: string;
    run(): Promise<void>;
    private displayAppUsage;
    private fetchAndDisplayAppUsageData;
    private fetchAndDisplayTeamUsageData;
    private getAppInfoFromTeamAddons;
}
