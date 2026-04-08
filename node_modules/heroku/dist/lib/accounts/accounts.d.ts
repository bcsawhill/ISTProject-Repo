import * as Heroku from '@heroku-cli/schema';
export interface IAccountsWrapper {
    list(): Heroku.Account[] | [];
    current(): Promise<string | null>;
    add(name: string, username: string, password: string): void;
    remove(name: string): void;
    set(name: string): Promise<void>;
}
export declare class AccountsWrapper implements IAccountsWrapper {
    private netrc;
    private initNetrc;
    private configDir;
    private account;
    list(): Heroku.Account[] | [];
    current(): Promise<string | null>;
    add(name: string, username: string, password: string): void;
    remove(name: string): void;
    set(name: string): Promise<void>;
}
declare const _default: AccountsWrapper;
export default _default;
