class htmlTable {
	table: any;
	id: string;

	constructor( id: string ) {
		this.id = id;
		this.table = document.getElementById( this.id );
	}

	private rows() {
		let rows: Array<any> = this.table.querySelectorAll( 'tr' );	
		return rows;
	}

	private headers() {
		let headerElements = this.rows()[0].querySelectorAll( 'td' );
		let headers: Array<string> = [];
		for ( let header of headerElements ) {
			headers.push( header.innerHTML );
		}
		return headers;
	}

	private data() {
		let array: Array<any> = [];
		let i: number = 0;
		this.rows().forEach( ( item, index ) => {
			if ( index > 0 )
				array.push( item );
		})
		return array;
	}

	private asJSON() {
		let array: Array<any> = [];
		let JSONArray: any = [];

		function getContent( array: Array<any>, headers: Array<any> = [] ) {
			let object: any = {};
			headers.forEach((header, index) => {
				object[header] = array[index].innerHTML;
			})
			return object;
		}
		for ( let row of this.data() ) {
			let cols: Array<any> = row.querySelectorAll( 'td' );
			let arrOfContent = getContent( cols, this.headers() );
			JSONArray.push( arrOfContent );
		}
		return JSONArray;
	}
}

class Table
{
	data: any;
	constructor( data ) {
		this.data = data;
	}

	unique( key: string ): number {
		let unique: any = {};

		this.data.forEach( (current, index) => {
			unique[current[key]] = 1 + ( unique [ current[ key ]] || 0);
		} )

		let count = Object.keys(unique).length;
		return count;
	}

	compare( params ): Data {
		// Compare:
		// compOrder` (>=, >, <=, <, =) sort order for value of `key` and compare `value`
		
		let key: string = params[0];
		let compOrder: string = params[1];
		let value: string = params[2];
		
		let data: any[] = [];

		for(var i = this.data.length - 1; i >= 0; i--) {

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

		return {
			count: data.length,
			data: data
		};
	}


	match( params ): Data {
		// Search:
		// Match [rules] found in string given by it's key/header

		let key: string = params[ 0 ];
		let rules: string[] = params[ 1 ];

		let data: any[] = [];
		
		function match( str, rule ) {
			return new RegExp( "^" + rule.split( "*" ).join( ".*" ) + "$" ).test( str ); // https://stackoverflow.com/questions/26246601/wildcard-string-comparison-in-javascript#32402438
		}
		function matchRules( rule, data, key ) {
			let list = [];
			for ( let line of data ) {
				let matched = match( line[ key ], rule );
				if ( matched )
					list.push( line );
			}			
			return list;
		}
		for ( let rule of rules ) {
			let matches = matchRules( rule, this.data, key )
			if ( matches )
				for ( let match of matches ) {
					data.push( match );
				}
		}

		return {
			count: data.length,
			data: data
		};
	}

	chain( chain: any[] ): Data {
		// let's chain the filters/methods
		let data: any;
		let filtered: any = this.data;

		for ( var i = 0; i < chain.length; i++ ) {
			let item = chain[i];
			let method: string = item[0]; // method to run from class Table
			let params: string[] = item[1]; // array of params to send to method
			data = filtered; // use filtered data from last iteration to filter further
			filtered = new Table( data )[method]( params ).data;
		}
		return {
			count: filtered.length,
			data: filtered
		};
	}
}

class Data {
	count: number;
	data: any[];
}
