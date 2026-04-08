import { vars } from '@heroku-cli/command';
import * as path from 'path';
import deps from './deps.js';
import fs from 'fs-extra';
import debug from 'debug';
const analyticsDebug = debug('heroku:analytics');
export default class AnalyticsCommand {
    config;
    userConfig;
    http;
    initialize;
    netrc;
    constructor(config) {
        this.config = config;
        this.http = deps.HTTP.create({
            headers: { 'user-agent': config.userAgent },
        });
        this.initialize = this.init();
    }
    async record(opts) {
        await this.initialize;
        const mcpMode = process.env.HEROKU_MCP_MODE === 'true';
        const mcpServerVersion = process.env.HEROKU_MCP_SERVER_VERSION || 'unknown';
        const { id, plugin } = opts.Command;
        if (!plugin) {
            analyticsDebug('no plugin found for analytics');
            return;
        }
        if (this.userConfig.skipAnalytics)
            return;
        const analyticsData = {
            event: id,
            properties: {
                cli: this.config.name,
                command: id,
                completion: await this._acAnalytics(id),
                version: `${this.config.version}${mcpMode ? ` (MCP ${mcpServerVersion})` : ''}`,
                plugin: plugin.name,
                plugin_version: plugin.version,
                os: this.config.platform,
                shell: this.config.shell,
                valid: true,
                language: 'node',
                install_id: this.userConfig.install,
            },
            source: 'cli',
        };
        const data = Buffer.from(JSON.stringify(analyticsData)).toString('base64');
        if (this.authorizationToken) {
            return this.http.get(`${this.url}?data=${data}`, { headers: { authorization: `Bearer ${this.authorizationToken}` } }).catch(error => analyticsDebug(error));
        }
        return this.http.get(`${this.url}?data=${data}`).catch(error => analyticsDebug(error));
    }
    get url() {
        return process.env.HEROKU_ANALYTICS_URL || 'https://backboard.heroku.com/hamurai';
    }
    get authorizationToken() {
        return process.env.HEROKU_API_KEY || this.netrcToken;
    }
    get netrcToken() {
        return this.netrc?.machines[vars.apiHost]?.password;
    }
    get usingHerokuAPIKey() {
        const k = process.env.HEROKU_API_KEY;
        return Boolean(k && k.length > 0);
    }
    get netrcLogin() {
        return this.netrc?.machines[vars.apiHost]?.login;
    }
    get user() {
        if (this.usingHerokuAPIKey)
            return;
        return this.netrcLogin;
    }
    async _acAnalytics(id) {
        if (id === 'autocomplete:options')
            return 0;
        const root = path.join(this.config.cacheDir, 'autocomplete', 'completion_analytics');
        const meta = {
            cmd: fs.pathExists(path.join(root, 'command')),
            flag: fs.pathExists(path.join(root, 'flag')),
            value: fs.pathExists(path.join(root, 'value')),
        };
        let score = 0;
        if (await meta.cmd)
            score += 1;
        if (await meta.flag)
            score += 2;
        if (await meta.value)
            score += 4;
        if (await fs.pathExists(root))
            await fs.remove(root);
        return score;
    }
    async init() {
        const NetrcModule = await import('netrc-parser');
        const NetrcClass = NetrcModule.Netrc || NetrcModule.default.constructor;
        this.netrc = new NetrcClass();
        await this.netrc.load();
        this.userConfig = new deps.UserConfig(this.config);
        await this.userConfig.init();
    }
}
