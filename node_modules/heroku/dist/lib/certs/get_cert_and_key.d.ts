/// <reference types="node" resolution-mode="require"/>
import type { PathLike } from 'node:fs';
export declare class CertAndKeyManager {
    getCertAndKey(args: {
        CRT: PathLike;
        KEY: PathLike;
    }): Promise<{
        crt: string;
        key: string;
    }>;
}
