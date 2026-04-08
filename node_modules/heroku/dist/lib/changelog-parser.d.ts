export declare class ChangelogParser {
    private readonly changelog;
    private constructor();
    private normalizeLineEndings;
    static create(changelogPath?: string): Promise<ChangelogParser>;
    static fromString(changelog: string): ChangelogParser;
    private static getDefaultChangelogPath;
    extractHeader(entry: string): string;
    extractMostRecentEntry(): null | string;
    extractSection(entry: string, sectionName: string): null | string;
    extractSections(entry: string, sectionNames: string[]): null | string;
    extractVersionEntry(version: string): null | string;
    private extractEntry;
}
