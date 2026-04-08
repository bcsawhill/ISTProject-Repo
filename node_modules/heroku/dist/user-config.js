import { randomUUID } from 'node:crypto';
import { stat } from 'node:fs/promises';
import * as path from 'path';
import fs from 'fs-extra';
import debug from 'debug';
const userConfigDebug = debug('heroku:user_config');
export default class UserConfig {
    config;
    needsSave = false;
    body;
    mtime;
    saving;
    _init;
    // eslint-disable-next-line no-useless-constructor
    constructor(config) {
        this.config = config;
    }
    get install() {
        return this.body.install || this.genInstall();
    }
    set install(install) {
        this.body.install = install;
        this.needsSave = true;
    }
    get skipAnalytics() {
        if (this.config.scopedEnvVar('SKIP_ANALYTICS') === '1')
            return true;
        if (typeof this.body.skipAnalytics !== 'boolean') {
            this.body.skipAnalytics = false;
            this.needsSave = true;
        }
        return this.body.skipAnalytics;
    }
    async init() {
        await this.saving;
        if (this._init)
            return this._init;
        this._init = (async () => {
            userConfigDebug('init');
            this.body = (await this.read()) || { schema: 1 };
            if (!this.body.schema) {
                this.body.schema = 1;
                this.needsSave = true;
            }
            else if (this.body.schema !== 1)
                this.body = { schema: 1 };
            // tslint:disable-next-line
            this.install;
            // tslint:disable-next-line
            this.skipAnalytics;
            if (this.needsSave)
                await this.save();
        })();
        return this._init;
    }
    get file() {
        return path.join(this.config.dataDir, 'config.json');
    }
    async save() {
        if (!this.needsSave)
            return;
        this.needsSave = false;
        this.saving = (async () => {
            userConfigDebug('saving');
            if (!await this.canWrite()) {
                throw new Error('file modified, cannot save');
            }
            await fs.outputJSON(this.file, this.body, { spaces: 2 });
        })();
    }
    async read() {
        await this.migrate();
        try {
            this.mtime = await this.getLastUpdated();
            const body = await fs.readJSON(this.file);
            return body;
        }
        catch (error) {
            if (error.code !== 'ENOENT')
                throw error;
            userConfigDebug('not found');
        }
    }
    async migrate() {
        if (await fs.pathExists(this.file))
            return;
        const old = path.join(this.config.configDir, 'config.json');
        if (!await fs.pathExists(old))
            return;
        userConfigDebug('moving config into new place');
        await fs.rename(old, this.file);
    }
    async canWrite() {
        if (!this.mtime)
            return true;
        return (await this.getLastUpdated()) === this.mtime;
    }
    async getLastUpdated() {
        try {
            const statResult = await stat(this.file);
            return statResult.mtime.getTime();
        }
        catch (error) {
            if (error.code !== 'ENOENT')
                throw error;
        }
    }
    genInstall() {
        this.install = randomUUID();
        return this.install;
    }
}
