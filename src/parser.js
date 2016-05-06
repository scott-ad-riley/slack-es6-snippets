const https = require('https');

module.exports = function () {
  this.rawContent = "";
  this.fetchLocalFile = function (path, callback) {
    fs.readFile(path, 'utf8', function (err,data) {
      if (err) {
        console.log(err);
        return false;
      }
      this.rawContent = data;
      return true;
    });
  }
  this.fetchRemoteFile = function (path, callback) {
    https.get({
      host: 'raw.githubusercontent.com',
      path: path
    }, function (response) {
      var body = '';
      response.on('data', function(d) {
          body += d;
      });
      response.on('end', function() {
          callback(body);
      });
    })
  }
}

//https://raw.githubusercontent.com/DrkSephy/es6-cheatsheet/master/README.md