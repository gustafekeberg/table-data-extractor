class Table {
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

	private toJSON() {
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

	unique(key: string) {
		let unique: any = {};

		this.toJSON().forEach( (current, index) => {
				unique[current[key]] = 1 + (unique[current[key]] || 0);
			} )

		let count = Object.keys(unique).length;
		return {
			count: count,
			unique: unique
		};
	}

	log() {
		return `First: ${ this.unique("First").count }, Last: ${ this.unique("Last").count }`;
	}
}
