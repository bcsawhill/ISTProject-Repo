import { APIClient } from '@heroku-cli/command';
import * as Heroku from '@heroku-cli/schema';
import inquirer from 'inquirer';
export declare class PipelineService {
    private herokuAPI;
    constructor(herokuAPI: APIClient);
    disambiguatePipeline(pipelineIDOrName: string): Promise<any>;
    getPipeline(flags: {
        app: null | string;
        pipeline: null | string;
    }): Promise<any>;
    promptForPipeline(pipelineIDOrName: string, choices: {
        name: string;
        value: Heroku.Pipeline;
    }[]): Promise<any> & {
        ui: inquirer.ui.Prompt<any>;
    };
}
export declare function promptForPipeline(pipelineIDOrName: string, choices: {
    name: string;
    value: Heroku.Pipeline;
}[]): Promise<any> & {
    ui: inquirer.ui.Prompt<any>;
};
export declare function disambiguatePipeline(pipelineIDOrName: string, herokuAPI: APIClient): Promise<any>;
export declare function getPipeline(flags: any, herokuAPI: APIClient): Promise<any>;
