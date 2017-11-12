export interface Data {
    count: number;
    data: any[];
}
export interface TableDataArray {
    headers: Array<string>;
    rows: Array<Array<string>>;
}
export interface TableRowMap<Type> {
    [key: string]: Type;
}
export interface Filter {
    type: string;
    key: string;
    condition: string;
    value: string;
    regexp: string;
    sequence: Filter[];
    name: string;
}
export declare class TableAnalyzer {
    tableData: TableRowMap<string>[];
    data: Data;
    constructor(tableData: TableRowMap<string>[]);
    private unique(key);
    private compare(filter);
    private match(filter);
    private sequence(filter);
    filter(filter: Filter): Data;
}
