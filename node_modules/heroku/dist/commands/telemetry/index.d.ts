import { Command } from '@heroku-cli/command';
import { TelemetryDrains } from '../../lib/types/telemetry.js';
export default class Index extends Command {
    static description: string;
    static example: string;
    static flags: {
        app: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        space: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
    };
    static topic: string;
    protected display(telemetryDrains: TelemetryDrains, owner: string | undefined): void;
    run(): Promise<void>;
}
