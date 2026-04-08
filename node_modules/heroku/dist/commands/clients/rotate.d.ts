import { Command } from '@heroku-cli/command';
export default class ClientsRotate extends Command {
    static args: {
        id: import("@oclif/core/interfaces").Arg<string, Record<string, unknown>>;
    };
    static description: string;
    static flags: {
        json: import("@oclif/core/interfaces").BooleanFlag<boolean>;
        shell: import("@oclif/core/interfaces").BooleanFlag<boolean>;
    };
    run(): Promise<void>;
}
