import { Command } from '@heroku-cli/command';
import * as Heroku from '@heroku-cli/schema';
import inquirer from 'inquirer';
export default class AppsTransfer extends Command {
    static args: {
        recipient: import("@oclif/core/interfaces").Arg<string, Record<string, unknown>>;
    };
    static description: string;
    static examples: string[];
    static flags: {
        app: import("@oclif/core/interfaces").OptionFlag<string, import("@oclif/core/interfaces").CustomOptions>;
        bulk: import("@oclif/core/interfaces").BooleanFlag<boolean>;
        confirm: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        locked: import("@oclif/core/interfaces").BooleanFlag<boolean>;
        remote: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
    };
    static topic: string;
    getAppsToTransfer(apps: Heroku.App[]): Promise<any> & {
        ui: inquirer.ui.Prompt<any>;
    };
    run(): Promise<void>;
}
