export declare class Editor {
    edit(input: string, options?: {}): Promise<string>;
}
export declare class EditorFactory {
    static createEditor(): Editor;
}
