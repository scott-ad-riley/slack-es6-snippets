const https = require('https');
const fs = require('fs');
const regex = require('./utils/regex');

const excludedKeywords = ["and", "/", "with", "versus", "functions"];

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
  this.parseHeadings = () => {
    var re = new RegExp(/\n##\s(.*)/g);
    var rawHeadings = regex.parse(re, this.rawContent);
    rawHeadings.shift();
    return rawHeadings.map((str) => this.removeHashtags(str.trim()));
  }
  this.parseSnippets = (heading) => {
    var startPosition = this.rawContent.indexOf("## " + heading) + heading.length;
    var endPosition = this.rawContent.indexOf("\n##", startPosition);
    var content = this.rawContent.slice(startPosition, endPosition);
    var re = new RegExp(/```([^`]*)```/g);
    return regex.parse(re, content);
  }
  this.removeHashtags = (str) => {
    var re = new RegExp(/##\s/g);
    return regex.replace(re, "", str);
  }
  this.buildLookupHash = (headingsArray) => {
    var lookup = {};
    headingsArray.forEach((heading, index) => {
      heading.split(" ").forEach((keyword) => {
        if (excludedKeywords.indexOf(keyword) === -1)
          lookup[keyword] = index;
      });
    });
    return lookup;
  }
  this.buildSnippetArrays = () => {
    var headings = this.parseHeadings();
    return headings.map(this.parseSnippets);
  }
}