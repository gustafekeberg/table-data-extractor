"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TableAnalyzer = /** @class */ (function () {
    function TableAnalyzer(tableData) {
        this.tableData = tableData;
        this.data = {
            count: tableData.length,
            data: tableData,
        };
    }
    TableAnalyzer.prototype.unique = function (key) {
        var filtered = [];
        var unique = {};
        this.tableData.forEach(function (current, index) {
            unique[current[key]] = 1 + (unique[current[key]] || 0);
        });
        var uniques = Object.keys(unique).length;
        return {
            count: uniques,
            data: []
        };
    };
    TableAnalyzer.prototype.compare = function (filter) {
        // Compare:
        // compOrder` (>=, >, <=, <, =) sort order for value of `key` and compare `value`
        var key = filter.key;
        var condition = filter.condition;
        var value = filter.value;
        var data = [];
        for (var i = this.tableData.length - 1; i >= 0; i--) {
            var current = this.tableData[i];
            var currentKey = current[key];
            var n = currentKey.localeCompare(value);
            switch (condition) {
                case ">=":
                    if (n == 1 || n == 0)
                        data.push(current);
                    break;
                case ">":
                    if (n == 1)
                        data.push(current);
                    break;
                case "<=":
                    if (n == -1 || n == 0)
                        data.push(current);
                    break;
                case "<":
                    if (n == -1)
                        data.push(current);
                    break;
                case "=":
                    if (n == 0)
                        data.push(current);
                    break;
            }
        }
        return {
            count: data.length,
            data: data
        };
    };
    TableAnalyzer.prototype.match = function (filter) {
        // Match [rules/regexp] found in string given by it's key/header
        var key = filter.key;
        var regexp = filter.regexp;
        function matchRule(rule, data, key) {
            var list = [];
            for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                var line = data_1[_i];
                var matched = new RegExp(rule).test(line[key]);
                if (matched)
                    list.push(line);
            }
            return list;
        }
        var matches = matchRule(regexp, this.tableData, key);
        return {
            count: matches.length,
            data: matches
        };
    };
    TableAnalyzer.prototype.sequence = function (filter) {
        var filteredTableData = this.tableData;
        var data = filteredTableData;
        var sequence = filter.sequence;
        var filtered = this.data;
        sequence.forEach(function (filter) {
            data = filteredTableData; // use filtered data from last iteration to filter further			
            var type = filter.type;
            filtered = new TableAnalyzer(data).filter(filter);
            filteredTableData = filtered.data;
        });
        return {
            count: filtered.count,
            data: filteredTableData
        };
    };
    TableAnalyzer.prototype.filter = function (filter) {
        var filteredData = {
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
    };
    return TableAnalyzer;
}());
exports.TableAnalyzer = TableAnalyzer;
