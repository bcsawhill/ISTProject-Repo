import { APIClient } from '@heroku-cli/command';
import * as Heroku from '@heroku-cli/schema';
export declare function getRelease(heroku: APIClient, appName: string, id: string): Promise<Heroku.Release>;
