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
}

export interface ExtendedFilter extends Filter {
	chain: Filter[];
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
		let unique: any = {};
		this.tableData.forEach((current: any, index) => {
			unique[current[key]] = 1 + (unique[current[key]] || 0);
		})

		let count = Object.keys(unique).length;

		return {
			count: count,
			data: unique
		};
	}

	private compare(params: any): Data {
		// Compare:
		// compOrder` (>=, >, <=, <, =) sort order for value of `key` and compare `value`

		let key: string = params[0];
		let compOrder: string = params[1];
		let value: string = params[2];

		let data: any[] = [];

		for (var i = this.tableData.length - 1; i >= 0; i--) {

			let current: any = this.tableData[i];
			let currentKey = current[key];
			let n = currentKey.localeCompare(value);

			switch (compOrder) {
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

	sequence(filterList: Filter[]): Data {
		// let's chain the filters/methods
		let data: TableRowMap<string>[];
		let filtered: TableRowMap<string>[] = this.tableData;


		// if filter type == chain
		filterList.forEach(item => {
			data = filtered; // use filtered data from last iteration to filter further			
			let filter = item.filter;
			let type = filter.type;
			switch (type) {
				case 'unique':
					// filtered = new TableAnalyzer(data).unique(filter.).data;
					break;
				case 'compare':
					break;
				case 'match':
					break;
			}
		});

		for (var i = 0; i < filterList.length; i++) {
			let item = filterList[i];
			let method: string = item[0]; // method to run from class Table
			let params: string[] = item[1]; // array of params to send to method
			data = filtered; // use filtered data from last iteration to filter further
			switch (method) {
				case 'unique':
					filtered = new TableAnalyzer(data).unique(params).data;
					break;
				case 'compare':
					filtered = new TableAnalyzer(data).compare(params).data;
					break;
				case 'match':
					filtered = new TableAnalyzer(data).match(params).data;
					break;
				default:
					console.log(`Error: "${method}" is not a valid filter `)
					break;
			}
		}
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
				break;
		}
		return filteredData;

		function runSequence(filter: ExtendedFilter) {
			filter.chain.forEach(filter => {
				runFilter(filter);
			});
		}
		// return filter;
	}
}
