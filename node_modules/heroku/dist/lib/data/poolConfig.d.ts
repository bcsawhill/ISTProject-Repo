import { ExtendedPostgresLevelInfo, PoolInfoResponse } from './types.js';
export default class PoolConfig {
    private readonly extendedLevelsInfo;
    private readonly followerInstanceCount;
    private followerCount;
    private followerLevel;
    private followerName;
    constructor(extendedLevelsInfo: ExtendedPostgresLevelInfo[], followerInstanceCount: number);
    followerInteractiveConfig(): Promise<{
        count: number;
        level: string;
        name?: string;
    }>;
    instanceCountStep(pool?: PoolInfoResponse): Promise<string>;
    levelStep(kind: 'Follower' | 'Leader', pool?: PoolInfoResponse, withGoBack?: boolean): Promise<string>;
    private followerConfirmationStep;
    private followerNameStep;
}
