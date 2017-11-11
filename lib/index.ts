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
	regexps: string[];
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

			if (unique[current[key]] >= 1)
				filtered.push(current);
		})

		return {
			count: filtered.length,
			data: filtered
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
		// Search:
		// Match [rules] found in string given by it's key/header

		let key: string = filter.key;
		let rules: string[] = filter.regexps;

		let data: any[] = [];

		function match(str: any, regexp: any) {
			return new RegExp(regexp).test(str); // https://stackoverflow.com/questions/26246601/wildcard-string-comparison-in-javascript#32402438
		}
		function matchRules(rule: any, data: any, key: any) {
			let list = [];
			for (let line of data) {
				let matched = match(line[key], rule);
				if (matched)
					list.push(line);
			}
			return list;
		}
		for (let rule of rules) {
			let matches = matchRules(rule, this.tableData, key)
			if (matches)
				for (let match of matches) {
					data.push(match);
				}
		}

		return {
			count: data.length,
			data: data
		};
	}

	private sequence(filter: Filter): Data {
		let filtered: TableRowMap<string>[] = this.tableData;
		let data: TableRowMap<string>[] = filtered;
		let sequence = filter.sequence;

		sequence.forEach(filter => {
			data = filtered; // use filtered data from last iteration to filter further			
			let type = filter.type;
			filtered = new TableAnalyzer(data).filter(filter).data;
		});

		return {
			count: filtered.length,
			data: filtered
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
