import { HTTPError } from '@heroku/http-call';
import { HerokuAPIError } from '@heroku-cli/command/lib/api-client.js';
const addonHeaders = {
    Accept: 'application/vnd.heroku+json; version=3.sdk',
    'Accept-Expansion': 'addon_service,plan',
};
export const appAddon = async function (heroku, app, id, options = {}) {
    const response = await heroku.post('/actions/addons/resolve', {
        body: { addon: id, addon_service: options.addon_service, app },
        headers: addonHeaders,
    });
    return singularize('addon', options.namespace)(response?.body);
};
const handleNotFound = function (err, resource) {
    if (err.statusCode === 404 && err.body && err.body.resource === resource) {
        return true;
    }
    throw err;
};
export const addonResolver = async (heroku, app, id, options) => {
    const getAddon = async (addonId) => {
        const response = await heroku.post('/actions/addons/resolve', {
            body: { addon: addonId, addon_service: options?.addon_service, app: null },
            headers: addonHeaders,
        });
        return singularize('addon', options?.namespace || '')(response?.body);
    };
    if (!app || id.includes('::')) {
        return getAddon(id);
    }
    try {
        return await appAddon(heroku, app, id, options);
    }
    catch (error) {
        if (error instanceof HTTPError && handleNotFound(error, 'add_on')) {
            return getAddon(id);
        }
        throw error;
    }
};
// -----------------------------------------------------
// Attachment resolver functions
// originating from `packages/addons-v5/lib/resolve.js`
// -----------------------------------------------------
const filter = function (app, addonService) {
    return (attachments) => attachments.filter(attachment => {
        if (attachment?.app?.name !== app) {
            return false;
        }
        return !(addonService && attachment?.addon_service?.name !== addonService);
    });
};
const attachmentHeaders = {
    Accept: 'application/vnd.heroku+json; version=3.sdk',
    'Accept-Inclusion': 'addon:plan,config_vars',
};
export const appAttachment = async (heroku, app, id, options = {}) => {
    const result = await heroku.post('/actions/addon-attachments/resolve', {
        body: { addon_attachment: id, addon_service: options.addon_service, app }, headers: attachmentHeaders,
    });
    return singularize('addon_attachment', options.namespace)(result.body);
};
export const attachmentResolver = async (heroku, app, id, options = {}) => {
    async function getAttachment(id) {
        try {
            const result = await heroku.post('/actions/addon-attachments/resolve', {
                body: { addon_attachment: id, addon_service: options.addon_service, app: null }, headers: attachmentHeaders,
            });
            return singularize('addon_attachment', options.namespace || '')(result.body);
        }
        catch (error) {
            if (error instanceof HerokuAPIError) {
                handleNotFound(error.http, 'add_on attachment');
            }
        }
    }
    async function getAppAddonAttachment(addon, app) {
        try {
            const result = await heroku.get(`/addons/${encodeURIComponent(addon.id ?? '')}/addon-attachments`, { headers: attachmentHeaders });
            const matches = filter(app, options.addon_service)(result.body);
            return singularize('addon_attachment', options.namespace)(matches);
        }
        catch (error) {
            const err = error instanceof HerokuAPIError ? error.http : error;
            handleNotFound(err, 'add_on attachment');
        }
    }
    // first check to see if there is an attachment matching this app/id combo
    try {
        const attachment = await (!app || id.includes('::') ? getAttachment(id) : appAttachment(heroku, app, id, options));
        if (attachment) {
            return attachment;
        }
    }
    catch { }
    // if no attachment, look up an add-on that matches the id
    // If we were passed an add-on slug, there still could be an attachment
    // to the context app. Try to find and use it so `context_app` is set
    // correctly in the SSO payload.
    if (app) {
        try {
            const addon = await resolveAddon(heroku, app, id, options);
            return await getAppAddonAttachment(addon, app);
        }
        catch (error) {
            const err = error instanceof HerokuAPIError ? error.http : error;
            handleNotFound(err, 'add_on attachment');
        }
    }
};
// -----------------------------------------------------
// END
// -----------------------------------------------------
const addonResolverMap = new Map();
export async function resolveAddon(...args) {
    const [, app, id, options] = args;
    const key = `${app}|${id}|${options?.addon_service ?? ''}`;
    const promise = addonResolverMap.get(key) || addonResolver(...args);
    try {
        await promise;
        addonResolverMap.has(key) || addonResolverMap.set(key, promise);
    }
    catch {
        addonResolverMap.delete(key);
    }
    return promise;
}
resolveAddon.cache = addonResolverMap;
export class NotFound extends Error {
    id = 'not_found';
    message = 'Couldn\'t find that addon.';
    statusCode = 404;
}
export class AmbiguousError extends Error {
    matches;
    type;
    body;
    message;
    statusCode = 422;
    constructor(matches, type) {
        super();
        this.matches = matches;
        this.type = type;
        this.message = `Ambiguous identifier; multiple matching add-ons found: ${matches.map(match => match.name).join(', ')}.`;
        this.body = { id: 'multiple_matches', message: this.message };
    }
}
function singularize(type, namespace) {
    return (matches) => {
        if (namespace) {
            matches = matches.filter(m => m.namespace === namespace);
        }
        else if (matches.length > 1) {
            // In cases that aren't specific enough, filter by namespace
            matches = matches.filter(m => !Reflect.has(m, 'namespace') || m.namespace === null);
        }
        switch (matches.length) {
            case 0: {
                throw new NotFound();
            }
            case 1: {
                return matches[0];
            }
            default: {
                throw new AmbiguousError(matches, type ?? '');
            }
        }
    };
}
