const assert = require('chai').assert;
const Parser = require('../src/parser');
const raw_file = require('./mock_data.js')();

describe('The Parser should', function () {
  var parser, parserFull;
  beforeEach(function () {
    parserEmpty = new Parser();
    parserFull = new Parser();
    parserFull.rawContent = raw_file;
  });

  it("be able to fetch a local docs file", function (done) {
    parserEmpty.fetchLocalFile('./raw_docs.md', function (err) {
      if (err) throw err;
      assert(parserEmpty.rawContent !== "", 'rawContent was empty');
      done();
    });
  });

  it("be able to fetch a file at a remote url", function (done) {
    parserEmpty.fetchRemoteFile('/DrkSephy/es6-cheatsheet/master/README.md', (err) => {
      if (err) throw err;
      assert(parserEmpty.rawContent !== "", 'rawContent was empty');
      done();
    });
  });

  it("return an array of matches from the headings in the document", function () {
    var result = parserFull.parseHeadings();
    assert.isArray(result, 'parsed headings was not an array');
  });

  it("return an array of matches from the headings with no hashtags", function () {
    var result = parserFull.parseHeadings();
    assert.notInclude(result.join(), '#', 'parsed headings contained a hashtag');
  });

  it("build an array of the snippets associated with a heading", function () {
    var testHeading = parserFull.parseHeadings()[0];
    var result = parserFull.parseSnippets(testHeading);
    assert.isArray(result, 'parsed snippets was not an array');
  });

  it("build a hash lookup of keywords for the headings", function () {
    var headings = parserFull.parseHeadings();
    var result = parserFull.buildLookupHash(headings);
    assert.isObject(result, 'hash lookup was not an object')
  });

  it("build a 2D array of snippets under each heading", function () {
    var result = parserFull.buildSnippetArrays();
    console.log(result);
    assert.isArray(result, 'collection of snippet arrays was not an array');
  })


});