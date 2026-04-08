import { flags } from '@heroku-cli/command';
import { Args } from '@oclif/core';
import tsheredoc from 'tsheredoc';
import { booleanConverter, PGSettingsCommand } from '../../../lib/pg/setter.js';
import { nls } from '../../../nls.js';
const heredoc = tsheredoc.default;
export default class LogConnections extends PGSettingsCommand {
    static topic = 'pg';
    static description = heredoc(`
  Controls whether a log message is produced when a login attempt is made. Default is true.
  Setting log_connections to false stops emitting log messages for all attempts to login to the database.`);
    static flags = {
        app: flags.app({ required: true }),
        remote: flags.remote(),
    };
    static args = {
        database: Args.string({ description: `${nls('pg:database:arg:description')} ${nls('pg:database:arg:description:default:suffix')}` }),
        value: Args.string({ description: 'boolean indicating if database login attempts get logged' }),
    };
    settingKey = 'log_connections';
    convertValue(val) {
        return booleanConverter(val);
    }
    explain(setting) {
        if (setting.value) {
            return 'When login attempts are made, a log message will be emitted in your application\'s logs.';
        }
        return 'When login attempts are made, no log message will be emitted in your application\'s logs.';
    }
}
