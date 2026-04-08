import { Command, flags } from '@heroku-cli/command';
import { Args, ux } from '@oclif/core';
import { color, hux, utils } from '@heroku/heroku-cli-util';
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
import tsheredoc from 'tsheredoc';
import { essentialPlan } from '../../lib/pg/util.js';
import { uuidValidate } from '../../lib/utils/uuid-validate.js';
const heredoc = tsheredoc.default;
const PGDIAGNOSE_HOST = process.env.PGDIAGNOSE_URL || 'pgdiagnose.herokai.com';
export default class Diagnose extends Command {
    static topic = 'pg';
    static description = heredoc(`
    run or view diagnostics report
    defaults to DATABASE_URL database if no DATABASE is specified
    if REPORT_ID is specified instead, a previous report is displayed

    `);
    static flags = {
        json: flags.boolean({ description: 'format output as JSON' }),
        app: flags.app({ required: true }),
        remote: flags.remote(),
    };
    static args = {
        'DATABASE|REPORT_ID': Args.string({ description: 'config var exposed to the owning app containing the database URL or the report ID' }),
    };
    async run() {
        const { flags, args } = await this.parse(Diagnose);
        const id = args['DATABASE|REPORT_ID'];
        let report;
        if (id && uuidValidate(id)) {
            ({ body: report } = await this.heroku.get(`/reports/${encodeURIComponent(id)}`, { hostname: PGDIAGNOSE_HOST }));
        }
        else {
            report = await this.generateReport(id, flags.app);
        }
        this.displayReport(report, flags.json);
    }
    displayReport(report, json) {
        if (json) {
            hux.styledJSON(report);
            return;
        }
        ux.stdout(`Report ${report.id} for ${report.app}::${report.database}\navailable for one month after creation on ${report.created_at}\n`);
        this.display(report.checks.filter((c) => c.status === 'red'));
        this.display(report.checks.filter((c) => c.status === 'yellow'));
        this.display(report.checks.filter((c) => c.status === 'green'));
        this.display(report.checks.filter((c) => !['green', 'red', 'yellow'].includes(c.status)));
    }
    display(checks) {
        checks.forEach((check) => {
            const colorFn = color[check.status] || ((txt) => txt);
            ux.stdout(colorFn(`${check.status.toUpperCase()}: ${check.name}`));
            const isNonEmptyArray = Array.isArray(check.results) && check.results.length > 0;
            const resultsKeys = Object.keys(check.results ?? {});
            if (check.status === 'green' || (!isNonEmptyArray && resultsKeys.length === 0)) {
                return;
            }
            if (isNonEmptyArray) {
                const keys = Object.keys(check.results[0]);
                const cols = {};
                keys.forEach((key) => {
                    const keyStr = String(key);
                    cols[capitalize(keyStr)] = {
                        get: (row) => String(row[key]),
                    };
                });
                hux.table(check.results, cols);
            }
            else {
                const [key] = resultsKeys;
                ux.stdout(`${key.split('_')
                    .map(s => capitalize(s))
                    .join(' ')} ${check.results[key]}`);
            }
        });
    }
    async generateParams(url, db, dbName) {
        const base_params = {
            url,
            plan: db.plan.name.split(':')[1],
            app: db.app.name,
            database: dbName,
        };
        if (!essentialPlan(db)) {
            const { body: metrics } = await this.heroku.get(`/client/v11/databases/${db.id}/metrics`, { hostname: utils.pg.host() });
            base_params.metrics = metrics;
            const { body: burstData } = await this.heroku.get(`/client/v11/databases/${db.id}/burst_status`, { hostname: utils.pg.host() });
            if (burstData && Object.keys(burstData).length > 0) {
                base_params.burst_data_present = true;
                base_params.burst_status = burstData.burst_status;
            }
        }
        return base_params;
    }
    async generateReport(database, app) {
        const dbResolver = new utils.pg.DatabaseResolver(this.heroku);
        const attachment = await dbResolver.getAttachment(app, database);
        const { addon: db } = attachment;
        const { body: config } = await this.heroku.get(`/apps/${app}/config-vars`);
        const { url } = dbResolver.getConnectionDetails(attachment, config);
        const dbName = utils.pg.psql.getConfigVarNameFromAttachment(attachment, config);
        const body = await this.generateParams(url, db, dbName);
        const { body: report } = await this.heroku.post('/reports', { hostname: PGDIAGNOSE_HOST, body });
        return report;
    }
}
