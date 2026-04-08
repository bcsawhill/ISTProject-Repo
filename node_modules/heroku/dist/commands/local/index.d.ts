import { Command } from '@oclif/core';
export default class Index extends Command {
    static aliases: string[];
    static args: {
        processname: import("@oclif/core/interfaces").Arg<string | undefined, Record<string, unknown>>;
    };
    static description: string;
    static examples: string[];
    static flags: {
        concurrency: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        env: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        port: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        procfile: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        restart: import("@oclif/core/interfaces").BooleanFlag<boolean>;
    };
    loadProcfile(procfilePath: string): Record<string, string>;
    run(): Promise<void>;
    runForeman(execArgv: string[]): Promise<void>;
}
