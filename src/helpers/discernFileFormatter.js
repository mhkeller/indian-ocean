import discernFormat from './discernFormat'
import formatters from '../formatters/index'

/**
 * Returns a formatter that will format json data to file type specified by the extension in `fileName`. Used internally by `.writeData` and `.writeDataSync`.
 * @param {String} fileName the name of the file
 * @returns {Object} a formatter that can write the file
 *
 * @example
 * var formatter = io.discernFileFormatter('path/to/data.tsv')
 * var csv = formatter(json)
 */
export default function discernFileFormatter (fileName) {
  var format = discernFormat(fileName)
  var formatter = formatters[format]
  // If we don't have a parser for this format, return as text
  if (typeof formatter === 'undefined') {
    formatter = formatters['txt']
  }
  return formatter
}
