import dsvFormat from 'd3-dsv/src/dsv'
import discernFormat from './discernFormat'
import parsers from '../parsers/index'

/**
 * Given a `fileName` return a parser that can read that file as json. Parses as text if format not supported by a built-in parser. If given a delimter string as the second argument, return a parser for that delimiter regardless of `fileName`. Used internally by `.readData` and `.readDataSync`.
 *
 * @function discernParser
 * @param {String} filePath Input file path
 * @param {String} delimiter Alternative usage is to pass a delimiter string. Delegates to `dsv.dsvFormat`.
 * @returns {Object} a parser that can read the file
 *
 * @example
 * var parser = io.discernParser('path/to/data.csv')
 * var json = parser('path/to/data.csv')
 * var parser = io.discernParser(null, '_')
 * var json = parser('path/to/data.usv')
 */
export default function discernParser (fileName, delimiter) {
  if (delimiter) {
    return dsvFormat(delimiter).parse
  }
  var format = discernFormat(fileName)
  var parser = parsers[format]
  // If we don't have a parser for this format, return as text
  if (typeof parser === 'undefined') {
    parser = parsers['txt']
  }
  return parser
}
