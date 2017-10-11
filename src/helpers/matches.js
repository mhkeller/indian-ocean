import extMatchesStr from './extMatchesStr'
import matchesRegExp from './matchesRegExp'
import isRegExp from '../utils/isRegExp'

/**
 * Test whether a file name or path matches a given matcher. Delegates to {@link extMatchesStr} if `matcher` is a string` and tests only against the file name extension. Delegates to {@link matchesRegExp} if matcher is a Regular Expression and tests against entire string, which is usefulf or testing the full file path.
 *
 * @function matches
 * @param {String} filePath Input file path or path to the file.
 * @returns {String|RegExp} matcher The string or Regular Expression to match against.
 *
 * @example
 * var matches = io.matches('path/to/data.tsv', 'tsv')
 * console.log(matches) // `true`
 *
 * var matches = io.matches('.gitignore', /\.gitignore/)
 * console.log(matches) // `true`
 *
 * var matches = io.matches('file/with/no-extention', '') // Nb. Dot files are treated as files with no extention
 * console.log(matches) // `true`
 */
export default function matches (filePath, matcher) {
  if (typeof matcher === 'string') {
    return extMatchesStr(filePath, matcher)
  } else if (isRegExp(matcher)) {
    return matchesRegExp(filePath, matcher)
  } else {
    throw new Error('Matcher argument must be String or Regular Expression')
  }
}
