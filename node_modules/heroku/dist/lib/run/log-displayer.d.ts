import { APIClient } from '@heroku-cli/command';
import { EventSource } from 'eventsource';
interface LogDisplayerOptions {
    app: string;
    dyno?: string;
    lines?: number;
    source?: string;
    tail: boolean;
    type?: string;
}
export declare class LogDisplayer {
    private heroku;
    constructor(heroku: APIClient);
    createEventSourceInstance(url: string, options?: any): EventSource;
    display(options: LogDisplayerOptions): Promise<void>;
    private buildRequestBodyParameters;
    private createLogSession;
    private getGenerationByAppId;
    private readLogs;
    private setupProcessHandlers;
}
export default function logDisplayer(heroku: APIClient, options: LogDisplayerOptions): Promise<void>;
export {};
