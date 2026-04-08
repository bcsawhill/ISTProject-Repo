import { Command } from '@heroku-cli/command';
import * as Heroku from '@heroku-cli/schema';
import { SpaceTopology } from '../../lib/types/spaces.js';
export default class Topology extends Command {
    static args: {
        space: import("@oclif/core/interfaces").Arg<string | undefined, Record<string, unknown>>;
    };
    static description: string;
    static flags: {
        json: import("@oclif/core/interfaces").BooleanFlag<boolean>;
        space: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
    };
    static topic: string;
    protected getProcessNum(s: string): number;
    protected getProcessType(s: string): string;
    protected render(topology: SpaceTopology, appInfo: Heroku.App[], json: boolean): void;
    run(): Promise<void>;
}
