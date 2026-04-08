import { Command } from '@heroku-cli/command';
export default class Info extends Command {
    static args: {
        telemetry_drain_id: import("@oclif/core/interfaces").Arg<string, Record<string, unknown>>;
    };
    static description: string;
    static example: string;
    static topic: string;
    run(): Promise<void>;
}
