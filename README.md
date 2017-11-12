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

sample filter:

```JS
[
	{
	"type": "match",
	"key": "Header 1",
	"regexp": "^Data (1|3)$"
	},
	{
		"type": "compare",
		"key": "Header 2",
		"condition": "<=",
		"value": "Data 2"
	}
]

```
