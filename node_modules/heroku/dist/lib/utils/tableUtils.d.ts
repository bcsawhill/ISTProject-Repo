export declare const constructSortFilterTableOptions: (flags: Record<string, string>, tableColumns: Record<string, any>) => Record<string, any>;
export declare const outputCSV: (tableData: Record<string, any>[], tableColumns: Record<string, any>) => void;
export declare const constructTableColumns: (allTableColumns: Record<string, any>, baseColumnNames: string[], extended: boolean, columns?: string) => Record<string, any>;
