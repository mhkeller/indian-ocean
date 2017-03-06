/**
 * Test whether a string matches a given Regular Expression.
 *
 * @param {String} fileName The name of the file or file path.
 * @param {RegExp} RegEx The RegEx to match with.
 * @returns {Boolean} whether The string matches the RegEx.
 *
 * @example
 * var matches = io.matchesRegExp('.gitignore', /\.gitignore/)
 * console.log(matches) // `true`
 *
 * var matches = io.matchesRegExp('data/final-data/basic.csv', /\/final-data\//)
 * console.log(matches) // `true`
 */
export default function matchesRegExp (str, regEx) {
  return regEx.test(str)
}
