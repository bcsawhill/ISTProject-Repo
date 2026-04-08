import { Command } from '@heroku-cli/command';
import { Args, ux } from '@oclif/core';
import { hux } from '@heroku/heroku-cli-util';
function trunc(val) {
    const v = (val ?? '').toString();
    return v.length > 56 ? v.slice(0, 56) + '...' : v;
}
async function checksum(heroku, app) {
    try {
        const { body: releases } = await heroku.request(`/apps/${app}/releases`, {
            partial: true,
            headers: { Range: 'version ..; max=1, order=desc' },
        });
        if (releases?.[0]?.slug) {
            const slugId = releases[0].slug.id;
            const { body: slug } = await heroku.get(`/apps/${app}/slugs/${slugId}`);
            return slug?.checksum ?? null;
        }
        return null;
    }
    catch (error) {
        const e = error;
        const status = e?.http?.statusCode ?? e?.response?.statusCode ?? e?.statusCode;
        if (status === 404) {
            throw new Error(`App not found: ${app}`);
        }
        throw error;
    }
}
async function diffFiles(heroku, app1, app2) {
    const sums = await Promise.all([checksum(heroku, app1), checksum(heroku, app2)]);
    return sums[0] === sums[1] ? [] : [{ prop: 'slug (checksum)', app1: sums[0] ?? undefined, app2: sums[1] ?? undefined }];
}
async function diffEnv(heroku, app1, app2) {
    const [res1, res2] = await Promise.all([
        heroku.get(`/apps/${app1}/config-vars`),
        heroku.get(`/apps/${app2}/config-vars`),
    ]);
    const vars1 = res1.body ?? {};
    const vars2 = res2.body ?? {};
    const keys = new Set([...Object.keys(vars1), ...Object.keys(vars2)]);
    return [...keys]
        .filter(k => vars1[k] !== vars2[k])
        .map(k => ({ prop: `config (${k})`, app1: vars1[k], app2: vars2[k] }));
}
async function diffStack(heroku, app1, app2) {
    const [res1, res2] = await Promise.all([
        heroku.get(`/apps/${app1}`),
        heroku.get(`/apps/${app2}`),
    ]);
    const a = res1.body?.stack?.name;
    const b = res2.body?.stack?.name;
    return a === b ? [] : [{ prop: 'stack', app1: a, app2: b }];
}
async function diffBuildpacks(heroku, app1, app2) {
    const [res1, res2] = await Promise.all([
        heroku.get(`/apps/${app1}/buildpack-installations`),
        heroku.get(`/apps/${app2}/buildpack-installations`),
    ]);
    const bps1 = res1.body ?? [];
    const bps2 = res2.body ?? [];
    const urls1 = bps1.map(obj => obj.buildpack?.url ?? '');
    const urls2 = bps2.map(obj => obj.buildpack?.url ?? '');
    const longest = urls1.length >= urls2.length ? urls1 : urls2;
    const pairs = longest.map((_, k) => ({
        prop: `buildpack (${k})`,
        app1: urls1[k],
        app2: urls2[k],
    }));
    return pairs.filter(pair => pair.app1 !== pair.app2);
}
async function diffAddons(heroku, app1, app2) {
    const [res1, res2] = await Promise.all([
        heroku.get(`/apps/${app1}/addons`),
        heroku.get(`/apps/${app2}/addons`),
    ]);
    const addons1 = res1.body ?? [];
    const addons2 = res2.body ?? [];
    const names1 = new Set(addons1.map(addon => addon.addon_service?.name ?? '').filter(Boolean));
    const names2 = new Set(addons2.map(addon => addon.addon_service?.name ?? '').filter(Boolean));
    const only1 = [...names1].filter(name => !names2.has(name)).map(name => ({ prop: `add-on (${name})`, app1: 'true', app2: 'false' }));
    const only2 = [...names2].filter(name => !names1.has(name)).map(name => ({ prop: `add-on (${name})`, app1: 'false', app2: 'true' }));
    return [...only1, ...only2];
}
async function diffFeatures(heroku, app1, app2) {
    const [res1, res2] = await Promise.all([
        heroku.get(`/apps/${app1}/features`),
        heroku.get(`/apps/${app2}/features`),
    ]);
    const features1 = res1.body ?? [];
    const features2 = res2.body ?? [];
    const names1 = new Set(features1.map(f => (f.enabled ? f.name : null)).filter(Boolean));
    const names2 = new Set(features2.map(f => (f.enabled ? f.name : null)).filter(Boolean));
    const only1 = [...names1].filter(name => !names2.has(name)).map(name => ({ prop: `feature (${name})`, app1: 'enabled', app2: 'disabled' }));
    const only2 = [...names2].filter(name => !names1.has(name)).map(name => ({ prop: `feature (${name})`, app1: 'disabled', app2: 'enabled' }));
    return [...only1, ...only2];
}
export default class AppsDiff extends Command {
    static args = {
        app1: Args.string({ description: 'first app to compare', required: true }),
        app2: Args.string({ description: 'second app to compare', required: true }),
    };
    static description = 'diffs two apps';
    static help = 'help text for apps:diff';
    static topic = 'apps';
    async run() {
        const { args } = await this.parse(AppsDiff);
        const { app1, app2 } = args;
        const files = await diffFiles(this.heroku, app1, app2);
        const [env, stack, bp, addons, features] = await Promise.all([
            diffEnv(this.heroku, app1, app2),
            diffStack(this.heroku, app1, app2),
            diffBuildpacks(this.heroku, app1, app2),
            diffAddons(this.heroku, app1, app2),
            diffFeatures(this.heroku, app1, app2),
        ]);
        const list = [...files, ...env, ...stack, ...bp, ...addons, ...features];
        const truncated = list.map(entry => ({
            prop: entry.prop,
            app1: trunc(entry.app1),
            app2: trunc(entry.app2),
        }));
        ux.stdout('\n');
        hux.table(truncated, {
            property: { header: 'property', get: (row) => row.prop },
            firstApp: { header: app1, get: (row) => row.app1 },
            secondApp: { header: app2, get: (row) => row.app2 },
        });
        ux.stdout('\n');
    }
}
