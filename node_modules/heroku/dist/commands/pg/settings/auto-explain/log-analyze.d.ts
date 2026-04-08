import { PGSettingsCommand, BooleanAsString } from '../../../../lib/pg/setter.js';
import { SettingKey, Setting } from '../../../../lib/pg/types.js';
export default class LogAnalyze extends PGSettingsCommand {
    static topic: string;
    static description: string;
    static args: {
        database: import("@oclif/core/interfaces").Arg<string | undefined, Record<string, unknown>>;
        value: import("@oclif/core/interfaces").Arg<string | undefined, Record<string, unknown>>;
    };
    protected settingKey: SettingKey;
    protected convertValue(val: BooleanAsString): boolean;
    protected explain(setting: Setting<boolean>): "EXPLAIN ANALYZE execution plans will be logged." | "EXPLAIN ANALYZE execution plans will not be logged.";
}
