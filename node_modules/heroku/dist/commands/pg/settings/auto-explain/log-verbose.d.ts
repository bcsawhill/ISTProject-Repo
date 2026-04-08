import { PGSettingsCommand } from '../../../../lib/pg/setter.js';
import type { Setting, SettingKey } from '../../../../lib/pg/types.js';
export default class AutoExplainLogVerbose extends PGSettingsCommand {
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
    protected settingKey: SettingKey;
    protected explain(setting: Setting<unknown>): "Verbose execution plan logging has been enabled for auto_explain." | "Verbose execution plan logging has been disabled for auto_explain.";
    protected convertValue(val: unknown): boolean;
}
