var path = require('path');
var fs = require('fs');
var fileConsole = null;

var _getConsole = function() {
    if (fileConsole === null) {
      var outPath = path.join(global.appRoot, 'out.log');
      var errorPath = path.join(global.appRoot, 'error.log');
      const output = fs.createWriteStream(outPath);
      const errorOutput = fs.createWriteStream(errorPath);

      const Console = console.Console;
      fileConsole = new Console(output, errorOutput);
    }
    return fileConsole;
}

module.exports.fileLogger = function() {
  this.log = function(log, params) {    
    _getConsole().log(log, params);
  }
}
