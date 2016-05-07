const request = require('request');
const env = require('node-env-file');
env("./.env");

const url = "https://slack.com/api/files.upload";

module.exports = function (snippetContents, targetList, feature, snippetNumber, snippetMax) {
  request.post(
    url,
    {
      form: {
        token: process.env.SLACK_BOT_TOKEN,
        content: snippetContents,
        filetype: "javascript",
        filename: "snippet.js",
        title: feature + " #" + snippetNumber + "/" + snippetMax,
        channels: targetList
      }
    },
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log("Snippet Response:", body);
      }
    }
  );
}