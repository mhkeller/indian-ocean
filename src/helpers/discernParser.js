/* istanbul ignore next */
import dsvFormat from 'd3-dsv/src/dsv'
import discernFormat from './discernFormat'
import parsers from '../parsers/index'

/**
 * Given a `filePath` return a parser that can read that file as json. Parses as text if format not supported by a built-in parser. If given a delimiter string as the second argument, return a parser for that delimiter regardless of `filePath`. Used internally by {@link readData} and {@link readDataSync}.
 *
 * @function discernParser
 * @param {String} [filePath] Input file path
 * @param {Object} [options] Optional options object, see below
 * @param {Object} [options.delimiter] If `{delimiter: true}`, it will treat the string given as `filePath` as a delimiter and delegate to `dsv.dsvFormat`.
 * @returns {Function} A parser that can parse a file string into json
 *
 * @example
 * var parser = io.discernParser('path/to/data.csv')
 * var json = parser('name,price\nApple,120\nPear,300')

 * var parser = io.discernParser('_', {delimiter: true})
 * var json = parser('name_price\nApple_120\nPear_300')
 */
export default function discernParser (filePath, opts_) {
  if (opts_ && opts_.delimiter === true) {
    return dsvFormat(filePath).parse
  }
  var format = discernFormat(filePath)
  var parser = parsers[format]
  // If we don't have a parser for this format, return as text
  if (typeof parser === 'undefined') {
    parser = parsers['txt']
  }
  return parser
}
