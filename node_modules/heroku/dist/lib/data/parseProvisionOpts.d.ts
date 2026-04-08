/**
 * Parses provision options from an array of KEY:VALUE or KEY strings.
 *
 * @param provisionOpts - Array of strings in KEY:VALUE or KEY format
 * @returns Record mapping keys to values (keys without values default to "true")
 *
 * @example
 * parseProvisionOpts(['fork:DATABASE', 'rollback:true', 'follow:', 'foo'])
 * // Returns: { fork: 'DATABASE', rollback: 'true', follow: 'true', foo: 'true' }
 *
 * @example
 * parseProvisionOpts(['key:value:with:colons'])
 * // Returns: { key: 'value:with:colons' } (splits on first colon only)
 */
export declare function parseProvisionOpts(provisionOpts: string[]): Record<string, string>;
