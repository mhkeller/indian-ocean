import {extname} from '../utils/path'

/**
 * Test whether a file name has the given extension
 *
 * @function extMatchesStr
 * @param {String} filePath Input file path
 * @param {String} extension The extension to test. An empty string will match a file with no extension.
 * @returns {Boolean} Whether it matched or not.
 *
 * @example
 * var matches = io.extMatchesStr('path/to/data.tsv', 'tsv')
 * console.log(matches) // `true`
 */
export default function extMatchesStr (filePath, extension) {
  // Chop '.' off extension returned by extname
  var ext = extname(filePath).slice(1)
  return ext === extension
}
