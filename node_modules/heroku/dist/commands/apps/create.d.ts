import { APIClient, Command } from '@heroku-cli/command';
import { Interfaces } from '@oclif/core';
export default class Create extends Command {
    static args: {
        app: Interfaces.Arg<string | undefined, Record<string, unknown>>;
    };
    static description: string;
    static examples: string[];
    static flags: {
        addons: Interfaces.OptionFlag<string | undefined, Interfaces.CustomOptions>;
        app: Interfaces.OptionFlag<string | undefined, Interfaces.CustomOptions>;
        buildpack: Interfaces.OptionFlag<string | undefined, Interfaces.CustomOptions>;
        features: Interfaces.OptionFlag<string | undefined, Interfaces.CustomOptions>;
        'internal-routing': Interfaces.BooleanFlag<boolean>;
        json: Interfaces.BooleanFlag<boolean>;
        kernel: Interfaces.OptionFlag<string | undefined, Interfaces.CustomOptions>;
        locked: Interfaces.BooleanFlag<boolean>;
        manifest: Interfaces.BooleanFlag<boolean>;
        'no-remote': Interfaces.BooleanFlag<boolean>;
        region: Interfaces.OptionFlag<string | undefined, Interfaces.CustomOptions>;
        remote: Interfaces.OptionFlag<string, Interfaces.CustomOptions>;
        space: Interfaces.OptionFlag<string | undefined, Interfaces.CustomOptions>;
        stack: Interfaces.OptionFlag<string | undefined, Interfaces.CustomOptions>;
        team: Interfaces.OptionFlag<string, Interfaces.CustomOptions>;
    };
    static hiddenAliases: string[];
    readManifest(): Promise<any>;
    run(): Promise<void>;
    runFromManifest(context: Interfaces.ParserOutput, heroku: APIClient): Promise<void>;
}
