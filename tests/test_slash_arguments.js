const assert = require('chai').assert;
const isValid = require('../src/command_validator');
const Parser = require('../src/parser');
const raw_file = require('./mock_data')();

describe('The Validator should', () => {
  var parser;
  before(function () {
    parser = new Parser();
    parser.rawContent = raw_file;
    parser.buildLookupHash();
    parser.buildSnippetArrays();
  });

  it("not allow empty arguments", () => {
    assert.isNotTrue(isValid("", parser), 'validator allowed empty arguments');
  });

  it("not allow a number first", () => {
    assert.isNotTrue(isValid("4", parser));
  });

  it("not allow text second", () => {
    assert.isNotTrue(isValid("arrow words", parser));
  });

  it("allow text, then a number", () => {
    assert.isTrue(isValid("arrow 2", parser));
  });

  it("allow text without a number", () => {
    assert.isTrue(isValid("arrow", parser));
  });

  it("allow text, then all", () => {
    assert.isTrue(isValid("arrow all", parser));
  });

  it("not allow invalid keywords/text", () => {
    assert.isNotTrue(isValid("foo", parser));
  });

  it("not allow a number out of range", () => {
    assert.isNotTrue(isValid("arrow 100", parser));
  });

});