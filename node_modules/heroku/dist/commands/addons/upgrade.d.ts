import type { Plan } from '@heroku-cli/schema';
import { Command } from '@heroku-cli/command';
export default class Upgrade extends Command {
    static aliases: string[];
    static args: {
        addon: import("@oclif/core/interfaces").Arg<string, Record<string, unknown>>;
        plan: import("@oclif/core/interfaces").Arg<string | undefined, Record<string, unknown>>;
    };
    static description: string;
    static examples: string[];
    static flags: {
        app: import("@oclif/core/interfaces").OptionFlag<string, import("@oclif/core/interfaces").CustomOptions>;
        remote: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
    };
    static topic: string;
    protected buildApiErrorMessage(errorMessage: string, ctx: any): string;
    protected buildNoPlanError(addon: string): string;
    protected getAddonPartsFromArgs(args: {
        addon: string;
        plan: string | undefined;
    }): {
        addon: string;
        plan: string;
    };
    protected getPlans(addonServiceName: string | undefined): Promise<Plan[]>;
    run(): Promise<void>;
}
