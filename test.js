var data = [{
		"one": "one",
		"two": "two"
	},
	{
		"one": "three",
		"two": "four"
	},
	{
		"one": "five",
		"two": "six"
	}
];
var filter = {
	"filter": [
		{
		"type": "match",
		"header": "two",
		"regexp": "^.*o.*$"
	},
		{
		"type": "match",
		"header": "one",
		"regexp": "^.*$"
	},
]
};

var extractor = require('./dist/index.js');

var table = new extractor.TableAnalyzer(data);
console.log(table.filter(filter));
