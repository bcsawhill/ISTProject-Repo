import type { DistinctChoice, ListChoiceMap } from 'inquirer';
import { APIClient } from '@heroku-cli/command';
import { ExtendedPostgresLevelInfo, PoolInfoResponse, PricingInfo } from './types.js';
/**
 * @description Formats pricing information into a human-readable text with both hourly and monthly rates
 * @param pricingInfo - The PricingInfo object
 * @param count - The number of units to calculate the pricing for
 * @returns A formatted string with colored pricing information, or empty string if no pricing info provided
 */
export declare function renderPricingInfo(pricingInfo?: PricingInfo | null, count?: number): string;
/**
 * @description Clears the cache of Postgres levels and pricing data.
 * Removes all cached entries, allowing subsequent calls to fetch levels and pricing to start fresh.
 * This is useful for testing or when you want to ensure fresh data is fetched.
 * @returns void
 */
export declare function clearLevelsAndPricingCache(): void;
/**
 * @description Fetches Postgres levels and pricing information for a given tier, with caching to avoid redundant API calls.
 * Makes parallel requests to fetch levels and pricing data, then combines them by matching level names with product descriptions.
 * Results are cached per tier to prevent duplicate requests. If a request fails, the cache entry is removed to allow retries.
 *
 * @param tier - The Postgres tier to fetch levels and pricing for (e.g., 'advanced')
 * @param dataApi - The API client instance used to make HTTP requests to the Heroku Data API
 * @returns Promise that resolves to an object containing:
 *   - `extendedLevelsInfo`: Array of Postgres level information with associated pricing data matched by product description
 *   - `optimizedStoragePricing`: Optional pricing information for storage-optimized plans, if available for the tier
 *
 * @throws {Error} Re-throws any errors from the API requests. The cache entry is removed on error to allow retries.
 *
 * @example
 *   const {extendedLevelsInfo, optimizedStoragePricing} = await fetchLevelsAndPricing('advanced', dataApi)
 *   // extendedLevelsInfo contains levels with their matching pricing information
 *   // optimizedStoragePricing may contain storage-optimized pricing if available
 */
export declare function fetchLevelsAndPricing(tier: string, dataApi: APIClient): Promise<{
    extendedLevelsInfo: ExtendedPostgresLevelInfo[];
    optimizedStoragePricing?: PricingInfo;
}>;
/**
 * @description Renders Postgres level information as formatted inquirer choices for interactive selection.
 * Formats each level with aligned columns showing name, vCPU count, memory, and pricing information.
 * The current level (if it matches the pool's expected level) is disabled in the choices.
 * Optionally includes a "Go back" option at the end of the list.
 *
 * @param extendedLevelsInfo - Array of Postgres level information with associated pricing data to render as choices
 * @param pool - Optional pool information used to identify and disable the current level in the choices
 * @param withGoBack - If true, adds a separator and "Go back" option at the end of the choices list (default: false)
 * @returns Promise that resolves to an array of inquirer choice objects, where each choice:
 *   - `name`: Formatted string with aligned columns showing level name, vCPU, memory, and pricing
 *   - `value`: The level name (used as the selected value)
 *   - `disabled`: Either `false` (selectable) or `'current level'` (if it matches the pool's expected level)
 *
 * @example
 *   const choices = await renderLevelChoices(extendedLevelsInfo, pool, true)
 *   // Returns choices array with formatted level options and optional "Go back" option
 *   // Current level (if matching pool) will be disabled
 */
export declare function renderLevelChoices(extendedLevelsInfo: ExtendedPostgresLevelInfo[], pool?: PoolInfoResponse, withGoBack?: boolean): Promise<Array<DistinctChoice<{
    level: string;
}, ListChoiceMap<{
    level: string;
}>>>>;
export declare function waitUntilMaintenanceComplete(addonId: string, shogun: APIClient): Promise<any>;
