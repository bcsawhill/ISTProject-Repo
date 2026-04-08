import { Command } from '@heroku-cli/command';
import type { BackupTransfer } from '../../../lib/pg/types.js';
export default class Info extends Command {
    static args: {
        backup_id: import("@oclif/core/interfaces").Arg<string | undefined, Record<string, unknown>>;
    };
    static description: string;
    static flags: {
        app: import("@oclif/core/interfaces").OptionFlag<string, import("@oclif/core/interfaces").CustomOptions>;
        remote: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
    };
    static topic: string;
    displayBackup: (backup: BackupTransfer, app: string) => void;
    displayLogs: (backup: BackupTransfer) => void;
    getBackup: (id: string | undefined, app: string) => Promise<BackupTransfer>;
    run(): Promise<void>;
}
