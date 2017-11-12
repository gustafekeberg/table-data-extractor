# html-table-data-extractor

Extract data from a table with headers and rows of data:

| Header 1 | Header 2 |
| -------- | -------- |
| Data 1   | Data 2   |
| Data 3   | Data 4   |

This library has one method - `filter()` - which returns filtered data from a defined filter.

Filters:

- unique
- match
- compare
- sequence (sequence of the above)

We need more documentation!

sample filter:

```JSON
{
	[
		{
		"type": "match",
		"key": "Header 1",
		"regexp": "^Data (1|3)$"
		}
	]

}
```
