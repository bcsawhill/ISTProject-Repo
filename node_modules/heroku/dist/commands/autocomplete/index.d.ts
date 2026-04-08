import { Interfaces } from '@oclif/core';
import { AutocompleteBase } from '../../lib/autocomplete/base.js';
export default class Index extends AutocompleteBase {
    static args: {
        shell: Interfaces.Arg<string | undefined, Record<string, unknown>>;
    };
    static description: string;
    static examples: string[];
    static flags: Interfaces.FlagInput;
    run(): Promise<void>;
    private updateCache;
}
