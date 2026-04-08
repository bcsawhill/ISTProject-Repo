import { Args } from '@oclif/core';
import tsheredoc from 'tsheredoc';
import { PGSettingsCommand, booleanConverter } from '../../../../lib/pg/setter.js';
import { nls } from '../../../../nls.js';
const heredoc = tsheredoc.default;
export default class LogTriggers extends PGSettingsCommand {
    static topic = 'pg';
    static description = heredoc(`
    Includes trigger execution statistics in execution plan logs.
    This parameter can only be used in conjunction with pg:settings:auto-explain:log-analyze turned on.
  `);
    static args = {
        database: Args.string({ description: `${nls('pg:database:arg:description')} ${nls('pg:database:arg:description:default:suffix')}` }),
        value: Args.string({ description: 'boolean indicating if the database has trigger execution statistics enabled' }),
    };
    settingKey = 'auto_explain.log_triggers';
    convertValue(val) {
        return booleanConverter(val);
    }
    explain(setting) {
        if (setting.value) {
            return 'Trigger execution statistics have been enabled for auto-explain.';
        }
        return 'Trigger execution statistics have been disabled for auto-explain.';
    }
}
