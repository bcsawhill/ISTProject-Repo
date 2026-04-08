import { Command } from '@oclif/core';
export default class VersionInfo extends Command {
    static args: {
        version: import("@oclif/core/interfaces").Arg<string | undefined, Record<string, unknown>>;
    };
    static description: string;
    static examples: string[];
    run(): Promise<void>;
}
