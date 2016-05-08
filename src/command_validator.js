const regex = require('./utils/regex');
module.exports = function (text, parser) {
  var testText = text.trim();
  if (testText === "") {
    return false;
  }
  if (parser.lookupHeadings(testText.split(" ")[0]) === undefined) {
    return false;
  }
  if (testText.split(" ").length > 1) {
    if (isNaN(testText.split(" ")[1]) && testText.split(" ")[1] !== "all") {
      return false;
    }
    var headingIndex = parser.lookupHeadings(testText.split(" ")[0]);
    if (parser.snippetsArray[headingIndex].length < testText.split(" ")[1]) {
      return false;
    }
  }
  return true;
}