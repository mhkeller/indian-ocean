import {extname} from '../utils/path'

/**
 * Given a `fileName` return its file extension. Used internally by `.discernPaser` and `.discernFileFormatter`.
 *
 * @function discernFormat
 * @param {String} filePath Input file path
 * @returns {String} the file's extension
 *
 * @example
 * var format = io.discernFormat('path/to/data.csv')
 * console.log(format) // 'csv'
 */
export default function discernFormat (fileName) {
  var extension = extname(fileName)
  if (extension === '') return false

  var formatName = extension.slice(1)
  return formatName
}
