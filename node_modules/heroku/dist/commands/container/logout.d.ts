import { Command } from '@heroku-cli/command';
import { DockerHelper } from '../../lib/container/docker_helper.js';
export default class Logout extends Command {
    static topic: string;
    static description: string;
    static flags: {
        verbose: import("@oclif/core/interfaces").BooleanFlag<boolean>;
    };
    dockerHelper: DockerHelper;
    run(): Promise<void>;
    dockerLogout(registry: string): Promise<string>;
}
