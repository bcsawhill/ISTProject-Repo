import { Command, flags } from '@heroku-cli/command';
import { Args, ux } from '@oclif/core';
import debug from 'debug';
import { utils, color } from '@heroku/heroku-cli-util';
import notify from '../../lib/notify.js';
import { nls } from '../../nls.js';
const wait = (ms) => new Promise(resolve => {
    setTimeout(resolve, ms);
});
export default class Wait extends Command {
    static topic = 'pg';
    static description = 'blocks until database is available';
    static flags = {
        'wait-interval': flags.string({ description: 'how frequently to poll in seconds (to avoid rate limiting)' }),
        'no-notify': flags.boolean({ description: 'do not show OS notification' }),
        app: flags.app({ required: true }),
        remote: flags.remote(),
    };
    static args = {
        database: Args.string({ description: `${nls('pg:database:arg:description')} ${nls('pg:database:arg:description:all-dbs:suffix')}` }),
    };
    async run() {
        const { flags, args } = await this.parse(Wait);
        const { app, 'wait-interval': waitInterval } = flags;
        const dbName = args.database;
        const pgDebug = debug('pg');
        const waitFor = async (db) => {
            let interval = waitInterval && Number.parseInt(waitInterval, 10);
            if (!interval || interval < 0)
                interval = 5;
            let status;
            let waiting = false;
            let retries = 20;
            const notFoundMessage = 'Waiting to provision...';
            while (true) {
                try {
                    ({ body: status } = await this.heroku.get(`/client/v11/databases/${db.id}/wait_status`, { hostname: utils.pg.host() }));
                }
                catch (error) {
                    const httpError = error;
                    pgDebug(httpError);
                    if (!retries || httpError.statusCode !== 404)
                        throw httpError;
                    retries--;
                    status = { 'waiting?': true, message: notFoundMessage };
                }
                if (status['error?']) {
                    notify('error', `${db.name} ${status.message}`, false);
                    ux.error(status.message || '', { exit: 1 });
                }
                if (!status['waiting?']) {
                    if (waiting) {
                        ux.action.stop(status.message);
                    }
                    return;
                }
                if (!waiting) {
                    waiting = true;
                    ux.action.start(`Waiting for database ${color.yellow(db.name)}`, status.message);
                }
                ux.action.status = status.message;
                await wait(interval * 1000);
            }
        };
        let dbs;
        if (dbName) {
            const dbResolver = new utils.pg.DatabaseResolver(this.heroku);
            const { addon } = await dbResolver.getAttachment(app, dbName);
            dbs = [addon];
        }
        else {
            const dbResolver = new utils.pg.DatabaseResolver(this.heroku);
            dbs = await dbResolver.getAllLegacyDatabases(app);
        }
        for (const db of dbs) {
            await waitFor(db);
        }
    }
}
