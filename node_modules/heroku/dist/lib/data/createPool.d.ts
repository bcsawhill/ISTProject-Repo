import { APIClient } from '@heroku-cli/command';
import { AddOn } from '@heroku-cli/schema';
import type { CreatePoolParameters, PoolInfoResponse } from './types.js';
export default function createPool(dataApi: APIClient, addon: AddOn, parameters: CreatePoolParameters): Promise<PoolInfoResponse>;
