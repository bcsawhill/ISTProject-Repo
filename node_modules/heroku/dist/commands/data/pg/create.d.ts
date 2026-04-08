import inquirer from 'inquirer';
import BaseCommand from '../../../lib/data/baseCommand.js';
export default class DataPgCreate extends BaseCommand {
    static baseFlags: Record<string, any>;
    static description: string;
    static examples: string[];
    static flags: {
        app: import("@oclif/core/interfaces").OptionFlag<string, import("@oclif/core/interfaces").CustomOptions>;
        as: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        confirm: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        followers: import("@oclif/core/interfaces").OptionFlag<number | undefined, import("@oclif/core/interfaces").CustomOptions>;
        'high-availability': import("@oclif/core/interfaces").BooleanFlag<boolean>;
        level: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        name: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        network: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        'provision-option': import("@oclif/core/interfaces").OptionFlag<string[] | undefined, import("@oclif/core/interfaces").CustomOptions>;
        remote: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        version: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        wait: import("@oclif/core/interfaces").BooleanFlag<boolean>;
    };
    static promptFlagActive: boolean;
    private addon;
    private extendedLevelsInfo;
    private followerInstanceCount;
    private highAvailability;
    private leaderLevel;
    prompt<T extends inquirer.Answers>(...args: Parameters<typeof inquirer.prompt<T>>): Promise<T>;
    run(): Promise<void>;
    runCommand(command: string, args: string[]): Promise<void>;
    private followerPoolConfigLoop;
    private highAvailabilityStep;
    private leaderConfirmationStep;
    private leaderLevelStep;
    private leaderPoolConfig;
}
