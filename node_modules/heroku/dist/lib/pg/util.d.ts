import type { AddOnAttachment } from '@heroku-cli/schema';
import { pg } from '@heroku/heroku-cli-util';
import { type CredentialInfo } from '../../lib/data/types.js';
export declare function essentialPlan(addon: pg.ExtendedAddon | pg.ExtendedAddonAttachment['addon']): boolean;
export declare function formatResponseWithCommands(response: string): string;
export declare function presentCredentialAttachments(app: string, credAttachments: Required<AddOnAttachment>[], credentials: CredentialInfo[], cred: string): string;
export declare const configVarNamesFromValue: (config: Record<string, string>, value: string) => string[];
export declare const databaseNameFromUrl: (uri: string, config: Record<string, string>) => string;
