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
export interface Filters {
    name: string;
    id: string;
    filter: Filter[];
}
export interface Filter {
    type: string;
    header: string;
    condition: string;
    value: string;
    regexp: string;
}
export declare class TableAnalyzer {
    tableData: TableRowMap<string>[];
    data: Data;
    constructor(tableData: TableRowMap<string>[]);
    private unique(header);
    private compare(filter);
    private match(filter);
    private selectMethod(filter);
    filter(filter: Filters): Data;
}
