import { Command } from '@heroku-cli/command';
export default class Services extends Command {
    static description: string;
    static flags: {
        json: import("@oclif/core/interfaces").BooleanFlag<boolean>;
    };
    static topic: string;
    run(): Promise<void>;
}
