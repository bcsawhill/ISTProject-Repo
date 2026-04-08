import { PGSettingsCommand } from '../../../lib/pg/setter.js';
import type { Setting, SettingKey } from '../../../lib/pg/types.js';
export default class LogStatement extends PGSettingsCommand {
    static description: string;
    static args: {
        database: import("@oclif/core/interfaces").Arg<string | undefined, Record<string, unknown>>;
        value: import("@oclif/core/interfaces").Arg<string | undefined, Record<string, unknown>>;
    };
    protected settingKey: SettingKey;
    protected convertValue(val: string): string;
    protected explain(setting: Setting<string>): string;
}
