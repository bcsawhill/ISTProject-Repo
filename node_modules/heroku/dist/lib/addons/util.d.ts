import * as Heroku from '@heroku-cli/schema';
export declare const trapConfirmationRequired: <T>(app: string, confirm: string | undefined, fn: (confirmed?: string) => Promise<T>) => Promise<T>;
export declare const formatPrice: ({ hourly, price }: {
    hourly?: boolean | undefined;
    price: Heroku.AddOn['price'] | number;
}) => string | undefined;
export declare const formatPriceText: (price: Heroku.AddOn['price']) => string;
export declare const grandfatheredPrice: (addon: Heroku.AddOn) => any;
export declare const formatState: (state: string) => string;
