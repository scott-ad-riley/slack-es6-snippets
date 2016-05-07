var request = require('request');
const SLACK_API_TOKEN = "xoxb-41027876145-rOhFPqzTwfvU5Ym82d1uJSXe";
const url = "https://slack.com/api/files.upload";

module.exports = function (snippetContents, targetList, feature, snippetNumber, snippetMax) {
  request.post(
    url,
    {
      form: {
        token: SLACK_API_TOKEN,
        content: snippetContents,
        filetype: "javascript",
        filename: "snippet.js",
        title: feature + " #" + snippetNumber + "/" + snippetMax,
        channels: targetList
      }
    },
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log("Snippet Posted");
      }
    }
  );
}