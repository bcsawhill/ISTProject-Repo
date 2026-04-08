import { PGSettingsCommand } from '../../../lib/pg/setter.js';
import type { Setting, SettingKey } from '../../../lib/pg/types.js';
export default class TrackFunctions extends PGSettingsCommand {
    static description: string;
    static args: {
        database: import("@oclif/core/interfaces").Arg<string | undefined, Record<string, unknown>>;
        value: import("@oclif/core/interfaces").Arg<string | undefined, Record<string, unknown>>;
    };
    protected settingKey: SettingKey;
    protected convertValue(val: unknown): unknown;
    protected explain(setting: Setting<keyof Setting<unknown>['value']>): string;
}
