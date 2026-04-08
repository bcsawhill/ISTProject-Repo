import { APIClient } from '@heroku-cli/command';
import { Domain } from '../types/domain.js';
export declare function waitForDomains(app: string, heroku: APIClient): Promise<Domain[]>;
