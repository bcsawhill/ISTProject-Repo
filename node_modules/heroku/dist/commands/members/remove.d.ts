import { Command } from '@heroku-cli/command';
export default class MembersRemove extends Command {
    static description: string;
    static flags: {
        team: import("@oclif/core/interfaces").OptionFlag<string, import("@oclif/core/interfaces").CustomOptions>;
    };
    static strict: boolean;
    static topic: string;
    run(): Promise<void>;
}
