import discernFormat from './discernFormat'
import formatters from '../formatters/index'

/**
 * Returns a formatter that will format json data to file type specified by the extension in `filePath`. Used internally by {@link writeData} and {@link writeDataSync}.
 *
 * @function discernFileFormatter
 * @param {String} filePath Input file path
 * @returns {Function} A formatter function that will write the extension format
 *
 * @example
 * var formatter = io.discernFileFormatter('path/to/data.tsv')
 * var csv = formatter(json)
 */
export default function discernFileFormatter (filePath) {
  var format = discernFormat(filePath)
  var formatter = formatters[format]
  // If we don't have a parser for this format, return as text
  if (typeof formatter === 'undefined') {
    formatter = formatters['txt']
  }
  return formatter
}
