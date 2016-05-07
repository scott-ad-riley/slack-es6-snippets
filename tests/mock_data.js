const fs = require('fs');
const path = require('path');

module.exports = function () {
  return fs.readFileSync(path.join(__dirname + '/../raw_docs.md'), 'utf8', (err,data) => {
    if (err) {
      console.log(err);
      return "error";
    }
    return data;
  });
}