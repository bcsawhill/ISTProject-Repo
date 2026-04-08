import { ScrubConfig, ScrubResult } from './types.js';
/**
 * Core Scrubber - Deep object traversal with PII scrubbing
 *
 * A high-performance, immutable scrubbing engine that removes sensitive data from structured objects.
 * Supports three scrubbing modes:
 * - **Field-based**: Scrubs values based on field names (e.g., 'password', 'apiToken')
 * - **Path-based**: Scrubs values at specific paths (e.g., 'user.email', 'request.headers.authorization')
 * - **Pattern-based**: Scrubs content matching regex patterns (e.g., SSN, credit cards)
 *
 * ### Design Principles
 * - **Immutable**: All operations create new objects, never mutate inputs
 * - **Type-safe**: Preserves TypeScript types through generic constraints
 * - **Circular-safe**: Handles circular references without crashing
 * - **Performance**: <1ms p95 for logging, <10ms p95 for exception handling (544k+ ops/sec)
 *
 * ### Pattern Adoption
 * Patterns adopted from `@heroku/oauth-provider-adapters-for-mcp/src/logging/redaction.ts`:
 * - Deep recursive traversal with circular reference detection
 * - Immutable cloning strategy with fallback for complex objects
 * - Nested path resolution (e.g., 'user.profile.email')
 * - General array path handling (e.g., 'users[0].password')
 * - Type-safe generics preserving input types
 *
 * Enhanced with:
 * - Field-based matching supporting both strings and regular expressions
 * - Pattern-based content scrubbing for SSN, credit cards, etc.
 * - Dual scrubbing: both field/path matching AND content pattern replacement
 *
 * @example Basic Usage
 * ```typescript
 * const scrubber = new Scrubber({
 *   fields: ['password', 'apiToken'],
 *   replacement: '[REDACTED]'
 * });
 *
 * const result = scrubber.scrub({
 *   user: { name: 'John', password: 'secret123' }
 * });
 * // Result: { user: { name: 'John', password: '[REDACTED]' } }
 * ```
 *
 * @example Advanced Usage with All Modes
 * ```typescript
 * const scrubber = new Scrubber({
 *   fields: ['password', /api[-_]?key/i],  // Regex matches api_key, api-key, apikey
 *   paths: ['user.email', 'request.headers.authorization'],
 *   patterns: [/\b\d{3}-\d{2}-\d{4}\b/g],  // SSN pattern
 *   replacement: '[SCRUBBED]'
 * });
 *
 * const result = scrubber.scrub({
 *   user: { name: 'John', email: 'john@example.com', password: 'secret' },
 *   request: { headers: { authorization: 'Bearer token123' } },
 *   message: 'User SSN is 123-45-6789'
 * });
 * ```
 */
export declare class Scrubber {
    private config;
    private circularRefs;
    private pathSet;
    /**
     * Creates a new Scrubber instance with the specified configuration
     *
     * @param config - Scrubbing configuration
     * @param config.fields - Field names to scrub (strings or regex patterns)
     * @param config.paths - Dot-notation paths to scrub (e.g., 'user.email', 'items[0].password')
     * @param config.patterns - Regex patterns for content scrubbing (must include global flag for multiple matches)
     * @param config.replacement - Replacement string for scrubbed values (default: '[SCRUBBED]')
     * @param config.recursive - Whether to recursively scrub nested objects (default: true)
     *
     * @example
     * ```typescript
     * const scrubber = new Scrubber({
     *   fields: ['password', /api[-_]?key/i],
     *   paths: ['user.email'],
     *   patterns: [/\b\d{3}-\d{2}-\d{4}\b/g],
     *   replacement: '[REDACTED]'
     * });
     * ```
     */
    constructor(config: ScrubConfig);
    /**
     * Scrubs sensitive data from an object
     *
     * This is the main entry point for the scrubbing engine. It performs three types of scrubbing:
     * 1. **Field-based**: Replaces values of fields matching configured field names/patterns
     * 2. **Path-based**: Replaces values at specific dot-notation paths
     * 3. **Pattern-based**: Replaces content within string values matching regex patterns
     *
     * The operation is immutable - the input object is not modified. A deep clone is created
     * and scrubbed values are replaced in the clone.
     *
     * ### Performance Characteristics
     * - Small objects (typical logs): ~0.003ms p95
     * - Medium objects (typical errors): ~0.034ms p95
     * - Large objects (10KB+): ~1.2ms p95
     * - Throughput: 54,000+ events/sec
     *
     * @template T - The type of the input object (preserved in output)
     * @param obj - The object to scrub
     * @returns A result object containing the scrubbed data, whether scrubbing occurred, and which paths were scrubbed
     *
     * @example Basic scrubbing
     * ```typescript
     * const scrubber = new Scrubber({ fields: ['password'] });
     * const result = scrubber.scrub({ user: 'john', password: 'secret' });
     * // result.data === { user: 'john', password: '[SCRUBBED]' }
     * // result.scrubbed === true
     * // result.scrubbedPaths === ['password']
     * ```
     *
     * @example Type preservation
     * ```typescript
     * interface User { name: string; email: string; password: string; }
     * const scrubber = new Scrubber({ fields: ['password', 'email'] });
     * const user: User = { name: 'John', email: 'john@example.com', password: 'secret' };
     * const result = scrubber.scrub(user);
     * // result.data is still typed as User
     * ```
     */
    scrub<T>(obj: T): ScrubResult<T>;
    private scrubObject;
    private scrubValue;
    /**
     * Check if a field name matches any configured sensitive field patterns
     */
    private isSensitiveField;
    private deepClone;
}
