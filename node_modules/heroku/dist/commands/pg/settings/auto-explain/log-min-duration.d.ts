import { PGSettingsCommand } from '../../../../lib/pg/setter.js';
import { Setting, SettingKey } from '../../../../lib/pg/types.js';
export default class LogMinDuration extends PGSettingsCommand {
    static topic: string;
    static description: string;
    static args: {
        database: import("@oclif/core/interfaces").Arg<string | undefined, Record<string, unknown>>;
        value: import("@oclif/core/interfaces").Arg<string | undefined, Record<string, unknown>>;
    };
    protected settingKey: SettingKey;
    protected convertValue(val: string): number;
    protected explain(setting: Setting<number>): string;
}
