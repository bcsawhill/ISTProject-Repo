import { Args } from '@oclif/core';
import tsheredoc from 'tsheredoc';
import { PGSettingsCommand, booleanConverter } from '../../../../lib/pg/setter.js';
import { nls } from '../../../../nls.js';
const heredoc = tsheredoc.default;
export default class LogBuffersWaits extends PGSettingsCommand {
    static topic = 'pg';
    static description = heredoc(`
    Includes buffer usage statistics when execution plans are logged.
    This is equivalent to calling EXPLAIN BUFFERS and can only be used in conjunction with pg:settings:auto-explain:log-analyze turned on.
  `);
    static args = {
        database: Args.string({ description: `${nls('pg:database:arg:description')} ${nls('pg:database:arg:description:default:suffix')}` }),
        value: Args.string({ description: 'boolean indicating if the database has buffer statistics enabled' }),
    };
    settingKey = 'auto_explain.log_buffers';
    convertValue(val) {
        return booleanConverter(val);
    }
    explain(setting) {
        if (setting.value) {
            return 'Buffer statistics have been enabled for auto_explain.';
        }
        return 'Buffer statistics have been disabled for auto_explain.';
    }
}
