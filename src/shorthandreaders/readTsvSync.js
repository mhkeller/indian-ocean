import readDataSync from '../readers/readDataSync'
import parserTsv from '../parsers/tsv'

/**
 * Synchronously read a tab-separated value file. Returns an empty array if file is empty.
 *
 * @param {String} fileName the name of the file
 * @param {Function} [map] Optional map function, called once for each row (header row skipped). Has signature `(row, i, columns)`. See example below or d3-dsv documentation for details.
 * @returns {Array} the contents of the file as JSON
 *
 * @example
 * var data = io.readTsvSync('path/to/data.tsv')
 * console.log(data) // Json data
 *
 * // Transform values on load
 * var data = io.readTsvSync('path/to/data.tsv', function (row, i, columns) {
 *   console.log(columns) // [ 'name', 'occupation', 'height' ]
 *   row.height = +row.height // Convert this value to a number
 *   return row
 * })
 * console.log(data) // Json data with casted values
 */
export default function readTsvSync (path, opts_) {
  var parserOptions
  if (typeof opts_ !== 'undefined') {
    parserOptions = typeof opts_ === 'function' ? {map: opts_} : opts_
  }
  return readDataSync(path, {parser: parserTsv, parserOptions: parserOptions})
}