/// <reference types="node" resolution-mode="require"/>
import { Command } from '@heroku-cli/command';
import { spawn as cpSpawn } from 'node:child_process';
export default class MCPStart extends Command {
    static baseFlags: Record<string, any>;
    static description: string;
    static promptFlagActive: boolean;
    static spawn: typeof cpSpawn;
    run(): Promise<import("child_process").ChildProcessWithoutNullStreams>;
}
