import BaseCommand from '../../../lib/data/baseCommand.js';
export default class Fork extends BaseCommand {
    static args: {
        database: import("@oclif/core/interfaces").Arg<string, Record<string, unknown>>;
    };
    static description: string;
    static examples: string[];
    static flags: {
        app: import("@oclif/core/interfaces").OptionFlag<string, import("@oclif/core/interfaces").CustomOptions>;
        as: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        confirm: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        level: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        name: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        'provision-option': import("@oclif/core/interfaces").OptionFlag<string[] | undefined, import("@oclif/core/interfaces").CustomOptions>;
        remote: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        'rollback-by': import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        'rollback-to': import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        wait: import("@oclif/core/interfaces").BooleanFlag<boolean>;
    };
    notify(message: string, success?: boolean): Promise<void>;
    /**
     * Parses a time interval string for rollback operations.
     * Automatically appends "ago" to make chrono parsing work with simple intervals.
     *
     * @param interval - Time interval like '3 days', '2 hours', or '3 days 7 hours'
     * @returns Date object representing the point in time for recovery
     * @throws Error if interval cannot be parsed
     *
     * @example
     * parseRollbackInterval('3 days')           // 3 days ago
     * parseRollbackInterval('2 days 5 hours')   // 2 days 5 hours ago
     * parseRollbackInterval('1 day ago')        // 1 day ago (doesn't double-add)
     */
    parseRollbackInterval(interval: string): Date;
    run(): Promise<void>;
    /**
     * Formats a Date object to the backend-expected timestamp format.
     * Format: YYYY-MM-DDTHH:MM:SS (e.g., '2025-11-17T15:20:00')
     *
     * @param date - Date object to format
     * @returns Formatted timestamp string
     */
    private formatRecoveryTime;
}
