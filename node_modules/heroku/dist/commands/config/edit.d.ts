import { Command } from '@heroku-cli/command';
interface Config {
    [key: string]: string;
}
export declare function stringToConfig(s: string): Config;
export default class ConfigEdit extends Command {
    static args: {
        key: import("@oclif/core/interfaces").Arg<string | undefined, Record<string, unknown>>;
    };
    static description: string;
    static examples: string[];
    static flags: {
        app: import("@oclif/core/interfaces").OptionFlag<string, import("@oclif/core/interfaces").CustomOptions>;
        remote: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
    };
    app: string;
    run(): Promise<void>;
    private diffPrompt;
    private fetchLatestConfig;
    private updateConfig;
    private verifyUnchanged;
}
export {};
