const app = require('express')();
const Parser = require('./src/parser');
const postSnippet = require('./src/slack_snippet');
const SLACK_APP_TOKEN = "zuRqzkw0Nfu9BAWVJW0cAZbe";
const log = console.log;
const docs = new Parser();

const bodyParser = require('body-parser');

docs.fetchLocalFile('./raw_docs.md', function () {
  docs.buildLookupHash();
  docs.buildSnippetArrays();
});

app.use(bodyParser.json())

app.get('/', function (req, res) {
  // validate a request with token
  if (req.query.token !== SLACK_APP_TOKEN) {
    res.status(403);
    res.send("Request Error: Invalid Token");
    return;
  }
  // parse out if argument
  if (!isValidArguments(req.query.text)) {
    res.status(400)
    res.send("Request Error: Invalid Arguments");
  }
  var arguments = collectArgs(req.query.text);
  // wrap snippet with response for user
  var snippet = lookupSnippet(arguments);
  // send response
  postSnippet(snippet.text, req.query.user_id, snippet.feature, snippet.index, snippet.max);
  res.send("I've just messaged you with a snippet :-)");
});

const isValidArguments = (text) => {
  var testText = text.trim();
  if (testText === "") {
    return false;
  }
  if (docs.lookupHeadings(testText.split(" ")[0]) === undefined) {
    return false;
  }
  if (testText.split(" ").length > 1) {
    if (isNaN(testText.split(" ")[1])) {
      return false;
    }
    var headingIndex = docs.lookupHeadings(testText.split(" ")[0]);
    if (docs.snippetsArray[headingIndex].length < testText.split(" ")[1]) {
      return false;
    }
  }
  return true;
}

const collectArgs = (text) => {
  var args = text.split(" ");
  return {
    feature: args[0], 
    snippet: Math.abs(args[1] - 1) || 0
  };
}

const lookupSnippet = (args) => {
  var featureIndex = docs.lookupHeadings(args.feature);
  return {
    text: docs.snippetsArray[featureIndex][args.snippet],
    index: args.snippet + 1,
    max: docs.snippetsArray[featureIndex].length,
    feature: docs.headings[featureIndex]
  }
}

app.listen(80);