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


export class TableAnalyzer {
	tableData: TableRowMap<string>[];
	data: Data;

	constructor(tableData: TableRowMap<string>[]) {
		this.tableData = tableData;
		this.data = {
			count: tableData.length,
			data: tableData,
		}
	}

	private unique(header: string): Data {
		let filtered: TableRowMap<string>[] = [];
		let unique: any = {};

		this.tableData.forEach((current: any, index) => {
			unique[current[header]] = 1 + (unique[current[header]] || 0);
		})
		let uniques = Object.keys(unique).length;
		return {
			count: uniques,
			data: []
		};
	}

	private compare(filter: Filter): Data {
		// Compare:
		// compOrder` (>=, >, <=, <, =) sort order for value of `key` and compare `value`

		let header: string = filter.header;
		let condition: string = filter.condition;
		let value: string = filter.value;

		let data: any[] = [];

		for (var i = this.tableData.length - 1; i >= 0; i--) {

			let current: any = this.tableData[i];
			let currentKey = current[header];
			let n = currentKey.localeCompare(value);

			switch (condition) {
				case ">=":
					if (n == 1 || n == 0) // greater than or equal to value
						data.push(current);
					break;
				case ">":
					if (n == 1) // greater than or equal to value
						data.push(current);
					break;
				case "<=":
					if (n == -1 || n == 0) // greater than or equal to value
						data.push(current);
					break;
				case "<":
					if (n == -1) // greater than or equal to value
						data.push(current);
					break;
				case "=":
					if (n == 0) // greater than or equal to value
						data.push(current);
					break;
			}
		}

		return {
			count: data.length,
			data: data
		};
	}

	private match(filter: Filter): Data {
		// Match [rules/regexp] found in string given by it's key/header

		let key: string = filter.header;
		let regexp: string = filter.regexp;

		function matchRule(rule: string, data: TableRowMap<string>[], key: string) {
			let list = [];
			for (let line of data) {
				let matched = new RegExp(rule).test(line[key])
				if (matched)
					list.push(line);
			}
			return list;
		}
		let matches = matchRule(regexp, this.tableData, key);

		return {
			count: matches.length,
			data: matches
		};
	}

	private selectMethod(filter: Filter) {
		let filteredData: Data = {
			count: 0,
			data: ["Something went wrong!"]
		};
		switch (filter.type) {
			case 'unique':
				filteredData = this.unique(filter.header);
				break;
			case 'match':
				filteredData = this.match(filter);
				break;
			case 'compare':
				filteredData = this.compare(filter);
				break;
		}
		return filteredData;
	}

	public filter(filter: Filters): Data {
		let filteredTableData: TableRowMap<string>[] = this.tableData;
		let data: TableRowMap<string>[] = filteredTableData;
		let sequence: Filter[] = filter.filter;
		let filtered: Data = this.data;
		sequence.forEach((filter: Filter) => {
			data = filteredTableData; // use filtered data from last iteration to filter further			
			let type = filter.type;
			filtered = new TableAnalyzer(data).selectMethod(filter);
			filteredTableData = filtered.data;
		});

		return {
			count: filtered.count,
			data: filteredTableData
		};
	}
}
