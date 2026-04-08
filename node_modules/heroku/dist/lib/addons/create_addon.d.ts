import { APIClient } from '@heroku-cli/command';
import * as Heroku from '@heroku-cli/schema';
export default function (heroku: APIClient, app: string, plan: string, confirm: string | undefined, wait: boolean, options: {
    actionStartMessage?: string;
    actionStopMessage?: string;
    as?: string;
    config: Record<string, boolean | string | undefined>;
    name?: string;
}): Promise<Heroku.AddOn>;
