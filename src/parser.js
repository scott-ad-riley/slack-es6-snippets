const https = require('https');
const fs = require('fs');
const regex = require('./utils/regex');

module.exports = function () {
  this.rawContent = "";
  this.fetchLocalFile = (path, callback) => {
    fs.readFile(path, 'utf8', (err,data) => {
      if (err) {
        console.log(err);
        return false;
      }
      this.rawContent = data;
      if (callback) callback();
      return true;
    });
  }
  this.fetchRemoteFile = (path, callback) => {
    https.get({
      host: 'raw.githubusercontent.com',
      path: path
    }, (response) => {
      var body = '';
      response.on('data', function(d) {
          body += d;
      });
      response.on('end', () => {
        this.rawContent = body;
        callback();
      });
    });
  }
  this.getHeadings = () => {
    var re = new RegExp(/##\s(.*)/g);
    var rawHeadings = regex.parse(re, this.rawContent);
    rawHeadings.shift();
    return rawHeadings.map(this.removeHashtags);
  }
  this.removeHashtags = (str) => {
    var re = new RegExp(/##\s/g);
    return regex.replace(re, "", str);
  }
}