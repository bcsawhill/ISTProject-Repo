import { Command } from '@heroku-cli/command';
import { DockerHelper } from '../../lib/container/docker_helper.js';
export default class Pull extends Command {
    static description: string;
    static examples: string[];
    static flags: {
        app: import("@oclif/core/interfaces").OptionFlag<string, import("@oclif/core/interfaces").CustomOptions>;
        remote: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        verbose: import("@oclif/core/interfaces").BooleanFlag<boolean>;
    };
    static strict: boolean;
    static topic: string;
    static usage: string;
    dockerHelper: DockerHelper;
    run(): Promise<void>;
}
