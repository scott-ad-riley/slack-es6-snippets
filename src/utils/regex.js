module.exports.parse = function (regex, string) {
  return string.match(regex) || [];
}

module.exports.replace = function (target, replacement, string) {
  return string.replace(target, replacement)
}
