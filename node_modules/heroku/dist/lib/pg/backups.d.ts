import { APIClient } from '@heroku-cli/command';
import type { BackupTransfer } from './types.js';
declare class Backups {
    protected app: string;
    protected heroku: APIClient;
    protected logsAlreadyShown: Set<string>;
    constructor(app: string, heroku: APIClient);
    protected displayLogs(logs: BackupTransfer['logs']): void;
    filesize(size: number, opts?: {}): string;
    name(transfer: BackupTransfer): string;
    num(name: string): Promise<number | undefined>;
    protected poll(transferID: string, interval: number, verbose: boolean, appId: string): AsyncGenerator<unknown, void, unknown>;
    status(transfer: BackupTransfer): string;
    wait(action: string, transferID: string, interval: number, verbose: boolean, app: string): Promise<void>;
}
declare function factory(app: string, heroku: APIClient): Backups;
export default factory;
