import { Command } from '@heroku-cli/command';
import * as Heroku from '@heroku-cli/schema';
export declare function renderAttachment(attachment: Heroku.AddOnAttachment, app: string, isLast?: boolean): string;
export default class Addons extends Command {
    static description: string;
    static examples: string[];
    static flags: {
        all: import("@oclif/core/interfaces").BooleanFlag<boolean>;
        app: import("@oclif/core/interfaces").OptionFlag<string, import("@oclif/core/interfaces").CustomOptions>;
        json: import("@oclif/core/interfaces").BooleanFlag<boolean>;
        remote: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
    };
    static topic: string;
    static usage: string;
    run(): Promise<void>;
}
