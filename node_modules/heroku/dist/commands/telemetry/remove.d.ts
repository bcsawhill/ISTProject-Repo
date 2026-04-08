import { Command } from '@heroku-cli/command';
import { TelemetryDrain } from '../../lib/types/telemetry.js';
export default class Remove extends Command {
    static topic: string;
    static description: string;
    static args: {
        telemetry_drain_id: import("@oclif/core/interfaces").Arg<string | undefined, Record<string, unknown>>;
    };
    static flags: {
        app: import("@oclif/core/interfaces").OptionFlag<string, import("@oclif/core/interfaces").CustomOptions>;
        space: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
    };
    run(): Promise<void>;
    protected removeDrain(telemetry_drain_id: string): Promise<TelemetryDrain>;
}
