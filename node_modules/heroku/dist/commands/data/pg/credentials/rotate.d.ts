import { hux } from '@heroku/heroku-cli-util';
import BaseCommand from '../../../../lib/data/baseCommand.js';
export default class Rotate extends BaseCommand {
    static args: {
        database: import("@oclif/core/interfaces").Arg<string, Record<string, unknown>>;
    };
    static description: string;
    static flags: {
        all: import("@oclif/core/interfaces").BooleanFlag<boolean>;
        app: import("@oclif/core/interfaces").OptionFlag<string, import("@oclif/core/interfaces").CustomOptions>;
        confirm: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        force: import("@oclif/core/interfaces").BooleanFlag<boolean>;
        name: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        remote: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
    };
    confirmCommand(...args: Parameters<typeof hux.confirmCommand>): Promise<void>;
    run(): Promise<void>;
    private getCredAttachmentsAndUniqueAppNames;
    private getCredsAndAttachments;
    private getCredToRotate;
    private renderWarnings;
}
