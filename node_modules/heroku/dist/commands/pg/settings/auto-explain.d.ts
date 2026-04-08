import { BooleanAsString, PGSettingsCommand } from '../../../lib/pg/setter.js';
import type { Setting, SettingKey } from '../../../lib/pg/types.js';
export default class AutoExplain extends PGSettingsCommand {
    static topic: string;
    static description: string;
    static flags: {
        app: import("@oclif/core/interfaces").OptionFlag<string, import("@oclif/core/interfaces").CustomOptions>;
        remote: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
    };
    static args: {
        database: import("@oclif/core/interfaces").Arg<string | undefined, Record<string, unknown>>;
        value: import("@oclif/core/interfaces").Arg<string | undefined, Record<string, unknown>>;
    };
    static strict: boolean;
    protected settingKey: SettingKey;
    protected convertValue(val: BooleanAsString): boolean;
    protected explain(setting: Setting<boolean>): string;
}
