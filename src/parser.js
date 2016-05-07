"use strict";
const https = require('https');
const fs = require('fs');
const regex = require('./utils/regex');

const excludedKeywords = ["and", "/", "with", "versus", "functions"];

module.exports = function () {
  this.rawContent = "";
  this.headingsLookup = {};
  this.snippetsArray = [];
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
    let startPosition = this.rawContent.indexOf("\n## " + heading) + heading.length;
    let endPosition = this.rawContent.indexOf("\n##", startPosition);
    let content = this.rawContent.slice(startPosition, endPosition);
    let re = new RegExp(/```([^`]*)```/g);
    return regex.parse(re, content).map(this.stripMarkdownTicks);
  }
  this.stripMarkdownTicks = (string) => {
    let re = new RegExp(/```(.*?)\n/g);
    let interim = regex.replace(re, "", string);
    return interim.replace("```", "");
  }
  this.removeHashtags = (str) => {
    let re = new RegExp(/##\s/g);
    return regex.replace(re, "", str);
  }
  this.buildLookupHash = (headingsArray) => {
    var headings = headingsArray || this.parseHeadings();
    headings.forEach((heading, index) => {
      heading.split(" ").forEach((keyword) => {
        if (excludedKeywords.indexOf(keyword) === -1)
          this.headingsLookup[keyword.toLowerCase()] = index;
      });
    });
    return this.headingsLookup;
  }
  this.buildSnippetArrays = () => {
    let headings = this.parseHeadings();
    this.snippetsArray = headings.map(this.parseSnippets);
    return this.snippetsArray;
  }
  this.lookupHeadings = (heading) => {
    return this.headingsLookup[heading.toLowerCase()];
  }
}