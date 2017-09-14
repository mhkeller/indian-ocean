import {extname} from '../utils/path'

/**
 * Given a `filePath` return the file's extension. Used internally by {@link discernParser} and {@link discernFileFormatter}. Returns `false` for files without an extension, including dotfiles
 *
 * @function discernFormat
 * @param {String} filePath Input file path
 * @returns {String} The file's extension
 *
 * @example
 * var format = io.discernFormat('path/to/data.csv')
 * console.log(format) // 'csv'
 *
 * @example
 * var format = io.discernFormat('path/to/.dotfile')
 * console.log(format) // false
 */
export default function discernFormat (filePath) {
  var ext = extname(filePath)
  if (ext === '') return false

  // Chop '.' off extension returned by extname
  var formatName = ext.slice(1)
  return formatName
}
