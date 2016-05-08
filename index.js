const app = require('express')();
const Parser = require('./src/parser');
const postSnippet = require('./src/slack_snippet');
const env = require('node-env-file');
const isValidArguments = require('./src/command_validator');
const docs = new Parser();
env('./.env');

docs.fetchLocalFile('./raw_docs.md', function () {
  docs.buildLookupHash();
  docs.buildSnippetArrays();
});

app.get('/', function (req, res) {
  // validate a request with token
  if (req.query.token !== process.env.SLACK_APP_TOKEN) {
    res.status(403);
    res.send("Request Error: Invalid Token");
    return;
  }
  // parse out if argument
  if (!isValidArguments(req.query.text, docs)) {
    res.status(400)
    res.send("Request Error: Invalid Arguments");
    return;
  }
  var arguments = collectArgs(req.query.text);
  // wrap snippet with response for user
  var snippet = lookupSnippet(arguments);
  // send response
  postSnippet(snippet.text, req.query.user_id, snippet.title);
  res.send("");
});

const collectArgs = (text) => {
  var args = text.split(" ");
  return {
    feature: args[0], 
    snippet: !isNaN(args[1]) ? Math.abs(args[1] - 1) : "all"
  };
}

const lookupSnippet = (args) => {
  var featureIndex = docs.lookupHeadings(args.feature);
  var title = docs.headings[featureIndex];
  if (args.snippet === "all") {
    var snippetText = docs.collectAllSnippets(featureIndex)
    title += " All Snippets (" + docs.snippetsArray[featureIndex].length + ")";
  } else {
    var snippetText = docs.snippetsArray[featureIndex][args.snippet];
    title += " #" + (args.snippet + 1) + "/" + docs.snippetsArray[featureIndex].length;
  }
  return {
    text: snippetText,
    title: title
  }
}

app.listen(80);