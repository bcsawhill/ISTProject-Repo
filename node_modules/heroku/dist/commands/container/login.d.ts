import { Command } from '@heroku-cli/command';
import { DockerHelper } from '../../lib/container/docker_helper.js';
export default class Login extends Command {
    static topic: string;
    static description: string;
    static flags: {
        verbose: import("@oclif/core/interfaces").BooleanFlag<boolean>;
    };
    dockerHelper: DockerHelper;
    run(): Promise<void>;
    dockerLogin(registry: string, password: string): Promise<string>;
    dockerLoginStdin(registry: string, password: string): Promise<string>;
    dockerLoginArgv(registry: string, password: string): Promise<string>;
}
