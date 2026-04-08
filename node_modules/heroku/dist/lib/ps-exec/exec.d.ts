import { APIClient } from '@heroku-cli/command';
import * as Heroku from '@heroku-cli/schema';
import { Response } from 'got';
interface ExecContext {
    app: string;
    auth: {
        password: string | undefined;
    };
    flags: {
        dyno?: string;
    };
}
export declare class HerokuExec {
    checkStatus(context: ExecContext, heroku: APIClient, configVars: Heroku.ConfigVars): Promise<void>;
    createSocksProxy(context: ExecContext, heroku: APIClient, configVars: Heroku.ConfigVars, callback?: (dynoIp: string, dyno: string, socksPort: number) => void): Promise<void>;
    initFeature(context: ExecContext, heroku: APIClient, callback: (configVars: Heroku.ConfigVars) => unknown, command?: string): Promise<void>;
    updateClientKey(context: ExecContext, heroku: APIClient, configVars: Heroku.ConfigVars, callback: (privkeypem: string, dyno: string, response: Response<string>) => Promise<void> | void): Promise<void>;
    private _dyno;
    private _enableFeature;
    private _execApiPath;
    private _execHeaders;
    private _execUrl;
    private _hasExecBuildpack;
}
export {};
