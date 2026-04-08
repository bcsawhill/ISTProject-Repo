import type { Quota } from './types.js';
/**
 * @description Formats a quota object into a human-readable status string.
 *
 * The status string includes the current usage of the quota, the critical quota limit, and the compliance message.
 *
 * @param {Quota} quota - The quota object to format.
 *
 * @returns {string} The formatted status string.
 */
export declare const formatQuotaStatus: (quota: Quota) => string;
/**
 * @description Displays a quota object in a human-readable format.
 *
 * @param {Quota} quota - The quota object to display.
 *
 * @returns {void}
 */
export declare const displayQuota: (quota: Quota) => void;
