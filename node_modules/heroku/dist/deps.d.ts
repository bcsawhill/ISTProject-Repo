import { HTTP } from '@heroku/http-call';
import UserConfig from './user-config.js';
import FS from 'fs-extra';
declare const _default: {
    readonly fs: typeof FS;
    readonly HTTP: typeof HTTP;
    readonly UserConfig: typeof UserConfig;
};
export default _default;
