import { APIClient } from '@heroku-cli/command';
import * as Heroku from '@heroku-cli/schema';
import { AppWithPipelineCoupling } from '../api.js';
export default function renderPipeline(heroku: APIClient, pipeline: Heroku.Pipeline, pipelineApps: Array<AppWithPipelineCoupling>, { showOwnerWarning, withOwners }?: {
    showOwnerWarning: boolean;
    withOwners: boolean;
}): Promise<void>;
