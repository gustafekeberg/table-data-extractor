class htmlTable {
	table: any;
	id: string;

	constructor (id: string) {
		this.id = id;
		this.table = document.getElementById(this.id);
	}

	private rows() {
		let rows: Array<any> = this.table.querySelectorAll('tr');	
		return rows;
	}

	private headers() {
		let headerElements = this.rows()[0].querySelectorAll('td');
		let headers: Array<string> = [];
		for (let header of headerElements) {
			headers.push(header.innerHTML);
		}
		return headers;
	}

	private data() {
		let array: Array<any> = [];
		let i: number = 0;
		this.rows().forEach(( item, index ) => {
			if (index > 0)
				array.push( item );
		})
		return array;
	}

	private asJSON() {
		let array: Array<any> = [];
		let JSONArray: any = [];

		function getContent (array: Array<any>, headers: Array<any> = []) {
			let object: any = {};
			headers.forEach((header, index) => {
				object[header] = array[index].innerHTML;
			})
			return object;
		}
		for (let row of this.data()) {
			let cols: Array<any> = row.querySelectorAll('td');
			let arrOfContent = getContent(cols, this.headers());
			JSONArray.push(arrOfContent);
		}
		return JSONArray;
	}
}

class Table
{
	data: any;
	constructor (data) {
		this.data = data;
	}
	unique(key: string) {
		let unique: any = {};

		this.data.forEach( (current, index) => {
			unique[current[key]] = 1 + (unique[current[key]] || 0);
		} )

		let count = Object.keys(unique).length;
		return {
			count: count,
			data: unique
		};
	}

	compare( params ) {
		// Compare:
		// compOrder` (>=, >, <=, <, =) sort order for value of `key` and compare `value`
		
		let key: string = params[0];
		let compOrder: string = params[1];
		let value: string = params[2];
		
		let data: any[] = [];

		for (var i = this.data.length - 1; i >= 0; i--) {

			let current: string = this.data[i];
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
				if (n == -1 ) // greater than or equal to value
					data.push(current);
				break;
				case "=":
				if (n == 0) // greater than or equal to value
					data.push(current);
				break;
			}
		}
		let count = data.length;

		return {
			count: count,
			data: data
		};
	}


	match( params ) {
		// Search:
		// Find a string in key

		let key: string = params[0];
		let rule: string = params[1];
		let data: any[] = [];

		// return new RegExp("^" + rule.split("*").join(".*") + "$").test(str);
		// for
	}

	chain (chain: any[]) {
		// let us chain filters/methods
		let data: any[] = [this.data];

		for ( var i = 0; i < chain.length; i++ ) {
			let current = chain[i];
			data[ data.length ] = new Table( data[ data.length - 1] )[ current[0] ]( current[1]).data;
		}

		return data[ data.length - 1 ];
	}
	test() {
		let strfy = function(json) {
			return JSON.stringify(json, null, 2);
		}
		// let compared = this.compare("Third", "<=", "3").data;
		// let newData = new Table(compared);
		// let newDataCompared = newData.compare("Third", ">=", "2").data;
		return `compare("Third"): ${ strfy( this.chain([
			[ "compare", ["Third", "<=", "3"] ],
			[ "compare", ["Third", ">=", "2"] ],
			[ "match", ["Last","*a*"] ]
			]) ) }`;
	}

}

