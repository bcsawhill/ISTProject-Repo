import { Command } from '@heroku-cli/command';
import { DockerHelper, DockerJob, GroupedDockerJobs } from '../../lib/container/docker_helper.js';
export default class Push extends Command {
    static description: string;
    static examples: string[];
    static flags: {
        app: import("@oclif/core/interfaces").OptionFlag<string, import("@oclif/core/interfaces").CustomOptions>;
        arg: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        'context-path': import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        recursive: import("@oclif/core/interfaces").BooleanFlag<boolean>;
        remote: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        verbose: import("@oclif/core/interfaces").BooleanFlag<boolean>;
    };
    static strict: boolean;
    static topic: string;
    dockerHelper: DockerHelper;
    run(): Promise<void>;
    selectJobs(jobs: GroupedDockerJobs, processTypes: string[], recursive: boolean): Promise<DockerJob[]>;
}
