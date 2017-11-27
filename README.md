# html-table-data-extractor

Extract data from a table with headers and rows of data:

| Header 1 | Header 2 |
| -------- | -------- |
| Data 1   | Data 2   |
| Data 3   | Data 4   |

This library has one method - `filter()` - which returns filtered data from a defined array of filters that run in sequence.

Filters:

- unique
- match
- compare
- sequence (sequence of the above)

We need more documentation!

Descripiton:

- A `filter` is an array of test to run on the table. The data from the first test will be passed to the next test until all test hav passed.
- `data` and `count` will be returned.
- If the `unique` filter is used no data is returned at the moment.
- `type` of filter `= match | unique | compare`
- `header` = name of the header to apply filter on
- `regexp` = regular expression when `match` is used
- `condition` = conditional test: `<= | >= | < | > | = | !=` (`!=` is not yet implemented)

Sample filter:

```JSON
[
	{
		"type": "match",
		"header": "Header 1",
		"regexp": "^Data (1|3)$"
	},
	{
		"type": "compare",
		"header": "Header 2",
		"condition": "<=",
		"value": "Data 2"
	},
	{
		"type": "unique",
		"header": "Header 1"
	}
]

```
