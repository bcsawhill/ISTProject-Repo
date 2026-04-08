import type { Answers } from 'inquirer';
import inquirer from 'inquirer';
import BaseCommand from '../../../lib/data/baseCommand.js';
import { PoolInfoResponse } from '../../../lib/data/types.js';
declare const prompt: inquirer.PromptModule;
export default class DataPgUpdate extends BaseCommand {
    static args: {
        database: import("@oclif/core/interfaces").Arg<string | undefined, Record<string, unknown>>;
    };
    static baseFlags: Record<string, any>;
    static description: string;
    static flags: {
        app: import("@oclif/core/interfaces").OptionFlag<string, import("@oclif/core/interfaces").CustomOptions>;
        remote: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
    };
    static promptFlagActive: boolean;
    private database;
    private extendedLevelsInfo;
    private followerInstanceCount;
    private pool;
    private selectedPoolOption;
    confirmCommand(comparison: string): Promise<void>;
    followerPoolActionStep(pool: PoolInfoResponse): Promise<string>;
    leaderPoolActionStep(pool: PoolInfoResponse): Promise<string>;
    prompt<T extends Answers>(...args: Parameters<typeof prompt<T>>): Promise<T>;
    run(): Promise<void>;
    private addFollowerPoolStage;
    /**
     * Helper function that attempts to find all Heroku Postgres Advanced-tier attachments on a given app.
     *
     * @param app - The name of the app to get the attachments for
     * @returns Promise resolving to an array of all Heroku Postgres Advanced-tier attachments on the app
     */
    private allAdvancedDatabaseAttachments;
    /**
     * Return all Heroku Postgres databases on the Advanced-tier for a given app.
     *
     * @param app - The name of the app to get the databases for
     * @returns Promise resolving to all Heroku Postgres databases
     * @throws {Error} When no legacy database add-on exists on the app
     */
    private getAllAdvancedDatabases;
    /**
     * Helper function that groups attachment names by addon.
     *
     * @param attachments - The attachments to group by addon
     * @returns A record of addon IDs with their attachment names
     */
    private getAttachmentNamesByAddon;
    private poolSelectionLoopStage;
    private poolSelectionStep;
    private renderDatabaseChoices;
    private renderPoolChoices;
}
export {};
