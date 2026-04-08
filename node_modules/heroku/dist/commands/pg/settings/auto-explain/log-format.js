import { Args } from '@oclif/core';
import { PGSettingsCommand } from '../../../../lib/pg/setter.js';
import tsheredoc from 'tsheredoc';
import { nls } from '../../../../nls.js';
const heredoc = tsheredoc.default;
export default class LogFormat extends PGSettingsCommand {
    static description = heredoc(`
    selects the EXPLAIN output format to be used
    The allowed values are text, xml, json, and yaml. The default is text.
  `);
    static args = {
        database: Args.string({ description: `${nls('pg:database:arg:description')} ${nls('pg:database:arg:description:default:suffix')}` }),
        value: Args.string({ options: ['text', 'json', 'yaml', 'xml'], description: 'format of the log output\n<options: text|json|yaml|xml>' }),
    };
    settingKey = 'auto_explain.log_format';
    explain(setting) {
        return `Auto explain log output will log in ${setting.value} format.`;
    }
    convertValue(val) {
        return val;
    }
}
