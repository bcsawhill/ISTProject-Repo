import { Command } from '@heroku-cli/command';
export default class Generate extends Command {
    static topic: string;
    static description: string;
    static help: string;
    static flags: {
        selfsigned: import("@oclif/core/interfaces").BooleanFlag<boolean>;
        keysize: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        owner: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        country: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        area: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        city: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        subject: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        now: import("@oclif/core/interfaces").BooleanFlag<boolean>;
        app: import("@oclif/core/interfaces").OptionFlag<string, import("@oclif/core/interfaces").CustomOptions>;
        remote: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
    };
    static args: {
        domain: import("@oclif/core/interfaces").Arg<string, Record<string, unknown>>;
    };
    promptForOwnerInfo(): Promise<any>;
    run(): Promise<void>;
    protected requiresPrompt(flags: any): boolean;
    protected getSubject(args: any, flags: any): any;
    protected spawnOpenSSL(args: ReadonlyArray<string>): Promise<unknown>;
}
