import { color, hux, utils, } from '@heroku/heroku-cli-util';
import { renderAttachment } from '../../commands/addons/index.js';
import { isAdvancedCredentialInfo } from '../../lib/data/types.js';
import { multiSortCompareFn } from '../utils/multisort.js';
export function essentialPlan(addon) {
    return utils.pg.isEssentialDatabase(addon) || utils.pg.isLegacyEssentialDatabase(addon);
}
export function formatResponseWithCommands(response) {
    return response.replaceAll(/`(.*?)`/g, (_, word) => color.code(word));
}
export function presentCredentialAttachments(app, credAttachments, credentials, cred) {
    const isForeignApp = (attOrAddon) => attOrAddon.app.name === app ? 0 : 1;
    const comparators = [
        (a, b) => {
            const fa = isForeignApp(a);
            const fb = isForeignApp(b);
            return fa < fb ? -1 : (fb < fa ? 1 : 0);
        },
        (a, b) => a.name.localeCompare(b.name),
        (a, b) => a.app?.name?.localeCompare(b.app?.name ?? '') ?? 0,
    ];
    credAttachments.sort(multiSortCompareFn(comparators));
    // render each attachment under the credential
    const attLines = credAttachments.map((attachment, idx) => {
        const isLast = (idx === credAttachments.length - 1);
        return renderAttachment(attachment, app, isLast);
    });
    // We would use utils.pg.isAdvancedDatabase from @heroku/heroku-cli-util, but we're not passing the add-on as a parameter.
    if (credentials.length > 0 && isAdvancedCredentialInfo(credentials[0])) {
        return [color.name(cred), ...attLines].join('\n') + '\n';
    }
    const rotationLines = [];
    const credentialStore = credentials.find(a => a.name === cred);
    if (credentialStore?.state === 'rotating') {
        const formatted = credentialStore?.credentials.map(credential => ({
            connections: credential.connections,
            state: credential.state,
            user: credential.user,
        }));
        // eslint-disable-next-line no-eq-null, eqeqeq
        const connectionInformationAvailable = formatted.some(c => c.connections != null);
        if (connectionInformationAvailable) {
            const prefix = '       ';
            rotationLines.push(`${prefix}Usernames currently active for this credential:`);
            const printLine = (line) => {
                rotationLines.push(line);
            };
            hux.table(formatted, {
                connections: {
                    get(row) {
                        return `${row.connections} connections`;
                    },
                },
                state: {
                    get(row) {
                        return row.state === 'revoking' ? 'waiting for no connections to be revoked' : row.state;
                    },
                },
                user: {
                    get(row) {
                        return `${prefix}${row.user}`;
                    },
                },
            }, {
                printLine,
            });
        }
    }
    return [color.name(cred), ...attLines, ...rotationLines].join('\n') + '\n';
}
export const configVarNamesFromValue = (config, value) => {
    const keys = [];
    for (const key of Object.keys(config)) {
        const configVal = config[key];
        if (configVal === value) {
            keys.push(key);
        }
        else if (configVal.startsWith('postgres://')) {
            try {
                const configURL = new URL(configVal);
                const ourURL = new URL(value);
                const components = ['protocol', 'hostname', 'port', 'pathname'];
                if (components.every(component => ourURL[component] === configURL[component])) {
                    keys.push(key);
                }
            }
            catch {
                // ignore -- this is not a valid URL so not a matching URL
            }
        }
    }
    const comparator = (a, b) => {
        const isDatabaseUrlA = Number(a === 'DATABASE_URL');
        const isDatabaseUrlB = Number(b === 'DATABASE_URL');
        return isDatabaseUrlA < isDatabaseUrlB ? -1 : (isDatabaseUrlB < isDatabaseUrlA ? 1 : 0);
    };
    return keys.sort(comparator);
};
export const databaseNameFromUrl = (uri, config) => {
    const names = configVarNamesFromValue(config, uri);
    let name = names.pop();
    while (names.length > 0 && name === 'DATABASE_URL')
        name = names.pop();
    if (name) {
        return color.name(name.replace(/_URL$/, ''));
    }
    const conn = utils.pg.DatabaseResolver.parsePostgresConnectionString(uri);
    return `${conn.host}:${conn.port}${conn.pathname}`;
};
