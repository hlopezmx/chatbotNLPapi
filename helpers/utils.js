var fs = require('fs');

var utils = function () {
};

utils.prototype.readfile = function (filename) {
    var contents = fs.readFileSync(filename).toString();
    return contents.split('\r\n');
}

module.exports = new utils();