import { Command } from '@heroku-cli/command';
import { GenerationKind } from '../../lib/apps/generation.js';
import KolkrabbiAPI from '../../lib/pipelines/kolkrabbi-api.js';
interface AppInfo {
    hash?: string;
    name: string;
    repo?: string;
}
export default class PipelinesDiff extends Command {
    static description: string;
    static examples: string[];
    static flags: {
        app: import("@oclif/core/interfaces").OptionFlag<string, import("@oclif/core/interfaces").CustomOptions>;
        remote: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
    };
    getAppInfo: (appName: string, appId: string, generation: GenerationKind) => Promise<AppInfo>;
    kolkrabbi: KolkrabbiAPI;
    run(): Promise<undefined>;
}
export {};
