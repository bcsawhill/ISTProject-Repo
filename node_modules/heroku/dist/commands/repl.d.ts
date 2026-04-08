import { Command } from '@oclif/core';
export default class Repl extends Command {
    static description: string;
    static examples: string[];
    static hidden: boolean;
    run(): Promise<void>;
}
