var Table = /** @class */ (function () {
    function Table(id) {
        this.id = id;
        this.table = document.getElementById(this.id);
    }
    Table.prototype.rows = function () {
        var rows = this.table.querySelectorAll('tr');
        return rows;
    };
    Table.prototype.headers = function () {
        var headerElements = this.rows()[0].querySelectorAll('td');
        var headers = [];
        for (var _i = 0, headerElements_1 = headerElements; _i < headerElements_1.length; _i++) {
            var header = headerElements_1[_i];
            headers.push(header.innerHTML);
        }
        return headers;
    };
    Table.prototype.data = function () {
        var array = [];
        var i = 0;
        this.rows().forEach(function (item, index) {
            if (index > 0)
                array.push(item);
        });
        return array;
    };
    Table.prototype.toJSON = function () {
        var array = [];
        var JSONArray = [];
        function getContent(array, headers) {
            if (headers === void 0) { headers = []; }
            var object = {};
            headers.forEach(function (header, index) {
                object[header] = array[index].innerHTML;
            });
            return object;
        }
        for (var _i = 0, _a = this.data(); _i < _a.length; _i++) {
            var row = _a[_i];
            var cols = row.querySelectorAll('td');
            var arrOfContent = getContent(cols, this.headers());
            JSONArray.push(arrOfContent);
        }
        return JSONArray;
    };
    Table.prototype.countUnique = function (key) {
        var unique = {};
        this.toJSON().forEach(function (current, index) {
            unique[current[key]] = 1 + (unique[current[key]] || 0);
        });
        var count = Object.keys(unique).length;
        return { count: count, unique: unique };
    };
    Table.prototype.log = function () {
        return "First: " + this.countUnique("First").count + ", Last: " + this.countUnique("Last").count;
    };
    return Table;
}());
var table = new Table("theTable");
console.log(table.log());
