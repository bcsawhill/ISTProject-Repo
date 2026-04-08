/// <reference types="node" resolution-mode="require"/>
/// <reference types="node" resolution-mode="require"/>
/// <reference types="node" resolution-mode="require"/>
import type { Duplex } from 'stream';
import { Command } from '@heroku-cli/command';
import * as net from 'net';
import * as tls from 'tls';
export default class Cli extends Command {
    static args: {
        database: import("@oclif/core/interfaces").Arg<string | undefined, Record<string, unknown>>;
    };
    static description: string;
    static examples: string[];
    static flags: {
        app: import("@oclif/core/interfaces").OptionFlag<string, import("@oclif/core/interfaces").CustomOptions>;
        confirm: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        remote: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
    };
    static topic: string;
    protected createBastionConnection(uri: URL, bastions: string, config: Record<string, unknown>, preferNativeTls: boolean): Promise<Duplex>;
    protected createDirectConnection(uri: URL, options: {
        portOffset?: number;
        useTls: boolean;
    }): net.Socket | tls.TLSSocket;
    run(): Promise<void>;
    private maybeTunnel;
}
