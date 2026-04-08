import { Command } from '@oclif/core';
export default class Run extends Command {
    static description: string;
    static examples: string[];
    static flags: {
        env: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        port: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
    };
    static strict: boolean;
    run(): Promise<void>;
}
