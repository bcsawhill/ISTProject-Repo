import { APIClient } from '@heroku-cli/command';
import { configRemote, getGitRemotes } from '@heroku-cli/command/lib/git.js';
import fs from 'fs-extra';
import pkg from 'lodash';
import * as path from 'path';
const { flatten } = pkg;
export const oneDay = 60 * 60 * 24;
export const herokuGet = async (resource, ctx) => {
    const heroku = new APIClient(ctx.config);
    let { body } = await heroku.get(`/${resource}`, { retryAuth: false });
    if (typeof body === 'string')
        body = JSON.parse(body);
    return body.map((a) => a.name).sort();
};
export const AppCompletion = {
    cacheDuration: oneDay,
    async options(ctx) {
        const teams = await herokuGet('teams', ctx);
        const apps = {
            personal: await herokuGet('users/~/apps', ctx),
            teams: flatten(await Promise.all(teams.map((team) => herokuGet(`teams/${team}/apps`, ctx)))),
        };
        return apps.personal.concat(apps.teams);
    },
};
export const AppAddonCompletion = {
    cacheDuration: oneDay,
    async cacheKey(ctx) {
        return ctx.flags && ctx.flags.app ? `${ctx.flags.app}_addons` : '';
    },
    async options(ctx) {
        const addons = ctx.flags && ctx.flags.app ? await herokuGet(`apps/${ctx.flags.app}/addons`, ctx) : [];
        return addons;
    },
};
export const AppDynoCompletion = {
    cacheDuration: oneDay,
    async cacheKey(ctx) {
        return ctx.flags && ctx.flags.app ? `${ctx.flags.app}_dynos` : '';
    },
    async options(ctx) {
        const dynos = ctx.flags && ctx.flags.app ? await herokuGet(`apps/${ctx.flags.app}/dynos`, ctx) : [];
        return dynos;
    },
};
export const BuildpackCompletion = {
    async options() {
        return [
            'heroku/ruby',
            'heroku/nodejs',
            'heroku/clojure',
            'heroku/python',
            'heroku/java',
            'heroku/gradle',
            'heroku/scala',
            'heroku/php',
            'heroku/go',
        ];
    },
    skipCache: true,
};
const ConfigCompletion = {
    cacheDuration: 60 * 60 * 24 * 7,
    async cacheKey(ctx) {
        return ctx.flags && ctx.flags.app ? `${ctx.flags.app}_config_vars` : '';
    },
    async options(ctx) {
        const heroku = new APIClient(ctx.config);
        if (ctx.flags && ctx.flags.app) {
            const { body: configs } = await heroku.get(`/apps/${ctx.flags.app}/config-vars`, { retryAuth: false });
            return Object.keys(configs);
        }
        return [];
    },
};
const ConfigSetCompletion = {
    cacheDuration: 60 * 60 * 24 * 7,
    async cacheKey(ctx) {
        return ctx.flags && ctx.flags.app ? `${ctx.flags.app}_config_set_vars` : '';
    },
    async options(ctx) {
        const heroku = new APIClient(ctx.config);
        if (ctx.flags && ctx.flags.app) {
            const { body: configs } = await heroku.get(`/apps/${ctx.flags.app}/config-vars`, { retryAuth: false });
            return Object.keys(configs).map(k => `${k}=`);
        }
        return [];
    },
};
export const DynoSizeCompletion = {
    cacheDuration: oneDay * 90,
    async options(ctx) {
        let sizes = await herokuGet('dyno-sizes', ctx);
        if (sizes)
            sizes = sizes.map(s => s.toLowerCase());
        return sizes;
    },
};
export const FileCompletion = {
    async options() {
        const files = await fs.readdir(process.cwd());
        return files;
    },
    skipCache: true,
};
export const PipelineCompletion = {
    cacheDuration: oneDay,
    async options(ctx) {
        const pipelines = await herokuGet('pipelines', ctx);
        return pipelines;
    },
};
export const ProcessTypeCompletion = {
    async options() {
        let types = [];
        const procfile = path.join(process.cwd(), 'Procfile');
        try {
            const buff = await fs.readFile(procfile);
            types = buff
                .toString()
                .split('\n')
                .map((s) => {
                if (!s)
                    return false;
                const m = s.match(/^([A-Za-z0-9_-]+)/);
                return m ? m[0] : false;
            })
                .filter((t) => t !== false);
        }
        catch (error) {
            if (error.code !== 'ENOENT')
                throw error;
        }
        return types;
    },
    skipCache: true,
};
export const ProtocolCompletion = {
    cacheDuration: 60 * 60 * 24 * 365,
    async options() {
        return ['tcp', 'udp', 'icmp', '0-255', 'any'];
    },
};
export const RegionCompletion = {
    cacheDuration: oneDay * 7,
    async options(ctx) {
        const regions = await herokuGet('regions', ctx);
        return regions;
    },
};
export const RemoteCompletion = {
    async options() {
        const remotes = getGitRemotes(configRemote());
        return remotes.map((r) => r.remote);
    },
    skipCache: true,
};
export const RoleCompletion = {
    async options() {
        return ['admin', 'collaborator', 'member', 'owner'];
    },
    skipCache: true,
};
export const ScopeCompletion = {
    async options() {
        return ['global', 'identity', 'read', 'write', 'read-protected', 'write-protected'];
    },
    skipCache: true,
};
export const SpaceCompletion = {
    cacheDuration: oneDay,
    async options(ctx) {
        const spaces = await herokuGet('spaces', ctx);
        return spaces;
    },
};
export const StackCompletion = {
    cacheDuration: oneDay,
    async options(ctx) {
        const stacks = await herokuGet('stacks', ctx);
        return stacks;
    },
};
export const StageCompletion = {
    async options() {
        return ['test', 'review', 'development', 'staging', 'production'];
    },
    skipCache: true,
};
export const TeamCompletion = {
    cacheDuration: oneDay,
    async options(ctx) {
        const teams = await herokuGet('teams', ctx);
        return teams;
    },
};
export const CompletionMapping = {
    addon: AppAddonCompletion,
    app: AppCompletion,
    buildpack: BuildpackCompletion,
    config: ConfigCompletion,
    configSet: ConfigSetCompletion,
    dyno: AppDynoCompletion,
    dynosize: DynoSizeCompletion,
    pipeline: PipelineCompletion,
    processtype: ProcessTypeCompletion,
    region: RegionCompletion,
    remote: RemoteCompletion,
    role: RoleCompletion,
    scope: ScopeCompletion,
    space: SpaceCompletion,
    stack: StackCompletion,
    stage: StageCompletion,
    team: TeamCompletion,
};
export class CompletionLookup {
    cmdId;
    name;
    description;
    blocklistMap = {
        app: ['apps:create'],
        space: ['spaces:create'],
    };
    commandArgsMap = {
        key: {
            'config:set': 'configSet',
        },
    };
    keyAliasMap = {
        key: {
            'config:get': 'config',
        },
    };
    constructor(cmdId, name, description) {
        this.cmdId = cmdId;
        this.name = name;
        this.description = description;
    }
    run() {
        if (this.blocklisted())
            return;
        return CompletionMapping[this.key];
    }
    argAlias() {
        return this.commandArgsMap[this.name] && this.commandArgsMap[this.name][this.cmdId];
    }
    blocklisted() {
        return this.blocklistMap[this.name] && this.blocklistMap[this.name].includes(this.cmdId);
    }
    descriptionAlias() {
        const d = this.description;
        if (d.match(/^dyno size/))
            return 'dynosize';
        if (d.match(/^process type/))
            return 'processtype';
    }
    get key() {
        return this.argAlias() || this.keyAlias() || this.descriptionAlias() || this.name;
    }
    keyAlias() {
        return this.keyAliasMap[this.name] && this.keyAliasMap[this.name][this.cmdId];
    }
}
