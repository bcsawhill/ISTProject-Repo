import type { Completion, CompletionContext } from '../types/completion.js';
export declare const oneDay: number;
export declare const herokuGet: (resource: string, ctx: CompletionContext) => Promise<string[]>;
export declare const AppCompletion: Completion;
export declare const AppAddonCompletion: Completion;
export declare const AppDynoCompletion: Completion;
export declare const BuildpackCompletion: Completion;
export declare const DynoSizeCompletion: Completion;
export declare const FileCompletion: Completion;
export declare const PipelineCompletion: Completion;
export declare const ProcessTypeCompletion: Completion;
export declare const ProtocolCompletion: {
    cacheDuration: number;
    options(): Promise<string[]>;
};
export declare const RegionCompletion: Completion;
export declare const RemoteCompletion: Completion;
export declare const RoleCompletion: Completion;
export declare const ScopeCompletion: Completion;
export declare const SpaceCompletion: Completion;
export declare const StackCompletion: Completion;
export declare const StageCompletion: Completion;
export declare const TeamCompletion: Completion;
export declare const CompletionMapping: {
    [key: string]: Completion;
};
export declare class CompletionLookup {
    private readonly cmdId;
    private readonly name;
    private readonly description?;
    private readonly blocklistMap;
    private readonly commandArgsMap;
    private readonly keyAliasMap;
    constructor(cmdId: string, name: string, description?: string | undefined);
    run(): Completion | undefined;
    private argAlias;
    private blocklisted;
    private descriptionAlias;
    private get key();
    private keyAlias;
}
