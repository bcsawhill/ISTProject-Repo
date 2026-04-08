import { color, utils } from '@heroku/heroku-cli-util';
import { flags as Flags, HerokuAPIError } from '@heroku-cli/command';
import { Args, ux } from '@oclif/core';
import tsheredoc from 'tsheredoc';
import { trapConfirmationRequired } from '../../../../lib/addons/util.js';
import BaseCommand from '../../../../lib/data/baseCommand.js';
const heredoc = tsheredoc.default;
export default class DataPgAttachmentsCreate extends BaseCommand {
    static args = {
        database: Args.string({
            description: 'database name, database attachment name, or related config var on an app',
            required: true,
        }),
    };
    static description = 'attach an existing Postgres Advanced database to an app';
    static flags = {
        app: Flags.app({ required: true }),
        as: Flags.string({ description: 'name for Postgres database attachment' }),
        confirm: Flags.string({ char: 'c', description: 'pass in the app name to skip confirmation prompts' }),
        credential: Flags.string({
            description: 'credential to use for database',
            exclusive: ['pool'],
        }),
        pool: Flags.string({ description: 'instance pool to attach' }),
        remote: Flags.remote(),
    };
    async run() {
        const { args, flags } = await this.parse(DataPgAttachmentsCreate);
        const { database: databaseArg } = args;
        const { app, as, confirm, credential, pool } = flags;
        const addonResolver = new utils.AddonResolver(this.heroku);
        // For attachment creation, app is always the target app where the attachment will be created.
        // When attaching to the same app, both add-on name and attachment name will resolve without issues
        // by passing the app name for resolution, but when attaching to a different app using the add-on name
        // to specify the source add-on, we have to remove the app name from the resolution for the resolver to
        // find the correct add-on.
        let addon;
        try {
            addon = await addonResolver.resolve(databaseArg, app, utils.pg.addonService());
        }
        catch (error) {
            if (error instanceof HerokuAPIError && error.http.statusCode === 404) {
                addon = await addonResolver.resolve(databaseArg, undefined, utils.pg.addonService());
            }
            else {
                throw error;
            }
        }
        if (!utils.pg.isAdvancedDatabase(addon)) {
            const cmd = `heroku addons:attach ${addon.name} -a ${app}${as ? ` --as ${as}` : ''}`
                + `${credential ? ` --credential ${credential}` : ''}`;
            ux.error('You can only use this command on Advanced-tier databases.\n'
                + `Use ${color.code(cmd)} instead.`);
        }
        const createAttachment = async (confirmed) => {
            let namespace;
            let attachMessage;
            if (credential) {
                namespace = 'role:' + credential;
                attachMessage = `Attaching ${color.yellow(credential) + ' on '}${color.addon(addon.name)}`
                    + `${as ? ' as ' + color.attachment(as) : ''} to ${color.app(app)}`;
            }
            else if (pool) {
                namespace = 'pool:' + pool;
                attachMessage = `Attaching ${color.yellow(pool) + ' on '}${color.addon(addon.name)}`
                    + `${as ? ' as ' + color.attachment(as) : ''} to ${color.app(app)}`;
            }
            else {
                attachMessage = `Attaching ${color.addon(addon.name)}`
                    + `${as ? ' as ' + color.attachment(as) : ''} to ${color.app(app)}`;
            }
            const body = {
                addon: { name: addon.name },
                app: { name: app },
                confirm: confirmed,
                name: as,
                namespace,
            };
            try {
                ux.action.start(attachMessage);
                const { body: attachment } = await this.heroku.post('/addon-attachments', { body });
                ux.action.stop();
                return attachment;
            }
            catch (error) {
                ux.action.stop(color.red('!'));
                throw error;
            }
        };
        if (credential) {
            const { body: credentialConfig } = await this.heroku.get(`/addons/${addon.name}/config/role:${encodeURIComponent(credential)}`);
            if (credentialConfig.length === 0) {
                ux.error(heredoc `
          The credential ${color.name(credential)} doesn't exist on the database ${color.datastore(addon.name)}.
          Use ${color.code(`heroku data:pg:credentials ${addon.name} -a ${app}`)} to list the credentials on the database.`, { exit: 1 });
            }
        }
        else if (pool) {
            const { body: poolConfig } = await this.heroku.get(`/addons/${addon.name}/config/pool:${encodeURIComponent(pool)}`);
            if (poolConfig.length === 0) {
                ux.error(heredoc `
          The pool ${color.name(pool)} doesn't exist on the database ${color.datastore(addon.name)}.
          Use ${color.code(`heroku data:pg:info ${addon.name} -a ${app}`)} to list the pools on the database.`, { exit: 1 });
            }
        }
        const attachment = await trapConfirmationRequired(app, confirm, (confirmed) => createAttachment(confirmed));
        try {
            ux.action.start(`Setting ${color.attachment(attachment.name)} config vars and restarting ${color.app(app)}`);
            const { body: releases } = await this.heroku.get(`/apps/${app}/releases`, {
                headers: { Range: 'version ..; max=1, order=desc' }, partial: true,
            });
            ux.action.stop(`done, v${releases[0].version}`);
        }
        catch (error) {
            ux.action.stop(color.red('!'));
            throw error;
        }
    }
}
