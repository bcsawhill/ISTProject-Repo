import { Args } from '@oclif/core';
import { booleanConverter, PGSettingsCommand } from '../../../../lib/pg/setter.js';
import { nls } from '../../../../nls.js';
export default class LogNestedStatements extends PGSettingsCommand {
    static description = "Nested statements are included in the execution plan's log.";
    static args = {
        database: Args.string({ description: `${nls('pg:database:arg:description')} ${nls('pg:database:arg:description:default:suffix')}` }),
        value: Args.string({ description: 'boolean indicating if execution plan logs include nested statements' }),
    };
    settingKey = 'auto_explain.log_nested_statements';
    convertValue(val) {
        return booleanConverter(val);
    }
    explain(setting) {
        if (setting.value) {
            return 'Nested statements will be included in execution plan logs.';
        }
        return 'Only top-level execution plans will be included in logs.';
    }
}
