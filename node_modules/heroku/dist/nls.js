import { nlsValues } from './nls-data.js';
/**
 * Non-localized strings util.
 *
 * @param key The key of the non-localized string to retrieve.
 * @return string
 */
export function nls(key) {
    return nlsValues[key];
}
