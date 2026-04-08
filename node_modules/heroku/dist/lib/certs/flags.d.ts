import { APIClient } from '@heroku-cli/command';
import { SniEndpoint } from '../types/sni_endpoint.js';
export default function (flags: {
    app: string;
    endpoint: string | undefined;
    name: string | undefined;
}, heroku: APIClient): Promise<SniEndpoint>;
