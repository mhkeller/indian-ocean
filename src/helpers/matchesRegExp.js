/**
 * Test whether a string matches a given Regular Expression.
 *
 * @function matchesRegExp
 * @param {String} filePath Input file path or file path.
 * @param {RegExp} RegExp The Regular Expression to match against.
 * @returns {Boolean} Whether they match.
 *
 * @example
 * var matches = io.matchesRegExp('.gitignore', /\.gitignore/)
 * console.log(matches) // `true`
 *
 * var matches = io.matchesRegExp('data/final-data/basic.csv', /\/final-data\//)
 * console.log(matches) // `true`
 */
export default function matchesRegExp (filePath, regEx) {
  return regEx.test(filePath)
}
