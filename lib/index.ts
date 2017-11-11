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

	private unique(key: string): Data {
		let filtered: TableRowMap<string>[] = [];
		let unique: any = {};

		this.tableData.forEach((current: any, index) => {
			unique[current[key]] = 1 + (unique[current[key]] || 0);
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

		let key: string = filter.key;
		let condition: string = filter.condition;
		let value: string = filter.value;

		let data: any[] = [];

		for (var i = this.tableData.length - 1; i >= 0; i--) {

			let current: any = this.tableData[i];
			let currentKey = current[key];
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

		let key: string = filter.key;
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

	private sequence(filter: Filter): Data {
		let filteredTableData: TableRowMap<string>[] = this.tableData;
		let data: TableRowMap<string>[] = filteredTableData;
		let sequence = filter.sequence;
		let filtered: Data = this.data;
		
		sequence.forEach(filter => {
			data = filteredTableData; // use filtered data from last iteration to filter further			
			let type = filter.type;
			filtered = new TableAnalyzer(data).filter(filter);
			filteredTableData = filtered.data;
		});

		return {
			count: filtered.count,
			data: filteredTableData
		};
	}

	filter(filter: Filter) {
		let filteredData: Data = {
			count: 0,
			data: ["Something went wrong!"]
		};
		switch (filter.type) {
			case 'unique':
				filteredData = this.unique(filter.key);
				break;
			case 'match':
				filteredData = this.match(filter);
				break;
			case 'compare':
				filteredData = this.compare(filter);
				break;
			case 'sequence':
				filteredData = this.sequence(filter);
				break;
		}
		return filteredData;
	}
}
