import { Interfaces } from '@oclif/core';
import { AutocompleteBase } from '../../lib/autocomplete/base.js';
export default class Doctor extends AutocompleteBase {
    static hidden: boolean;
    static description: string;
    static args: {
        shell: Interfaces.Arg<string | undefined, Record<string, unknown>>;
    };
    static flags: Interfaces.FlagInput;
    run(): Promise<void>;
    private printList;
}
