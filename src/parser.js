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
      let body = '';
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
    let re = new RegExp(/\n##\s(.*)/g);
    let rawHeadings = regex.parse(re, this.rawContent);
    rawHeadings.shift();
    return rawHeadings.map((str) => this.removeHashtags(str.trim()));
  }
  this.parseSnippets = (heading) => {
    let startPosition = this.rawContent.indexOf("## " + heading) + heading.length;
    let endPosition = this.rawContent.indexOf("\n##", startPosition);
    let content = this.rawContent.slice(startPosition, endPosition);
    let re = new RegExp(/```([^`]*)```/g);
    return regex.parse(re, content);
  }
  this.removeHashtags = (str) => {
    let re = new RegExp(/##\s/g);
    return regex.replace(re, "", str);
  }
  this.buildLookupHash = (headingsArray) => {
    let lookup = {};
    headingsArray.forEach((heading, index) => {
      heading.split(" ").forEach((keyword) => {
        if (excludedKeywords.indexOf(keyword) === -1)
          lookup[keyword] = index;
      });
    });
    return lookup;
  }
  this.buildSnippetArrays = () => {
    let headings = this.parseHeadings();
    return headings.map(this.parseSnippets);
  }
}