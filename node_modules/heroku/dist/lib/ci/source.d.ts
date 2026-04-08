/// <reference types="node" resolution-mode="require"/>
import { Command } from '@heroku-cli/command';
export declare class FileService {
    createReadStream(filePath: string): import("fs").ReadStream;
    stat(filePath: string): Promise<import("fs").Stats>;
}
declare const fileService: FileService;
export declare function createSourceBlob(ref: any, command: Command): Promise<any>;
export { fileService };
export { gitService } from './git.js';
