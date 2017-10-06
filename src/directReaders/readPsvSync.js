import readDataSync from '../readers/readDataSync'
import parserPsv from '../parsers/psv'

/**
 * Synchronously read a pipe-separated value file. Returns an empty array if file is empty.
 *
 * @function readPsvSync
 * @param {String} filePath Input file path
 * @param {Function|Object} [map] Optional map function or an object with `map` key that is a function. Called once for each row with the signature `(row, i)` and must return the transformed row. See example below or d3-dsv documentation for details.
 * @returns {Array} The contents of the file as JSON
 *
 * @example
 * var data = io.readPsvSync('path/to/data.psv')
 * console.log(data) // Json data
 *
 * var data = io.readPsvSync('path/to/data.psv', function (row, i, columns) {
 *   console.log(columns) // [ 'name', 'occupation', 'height' ]
 *   row.height = +row.height // Convert this value to a number
 *   return row
 * })
 * console.log(data) // Json data with casted values
 */
export default function readPsvSync (filePath, opts_) {
  var parserOptions
  if (typeof opts_ !== 'undefined') {
    parserOptions = typeof opts_ === 'function' ? {map: opts_} : opts_
  }
  return readDataSync(filePath, {parser: parserPsv, parserOptions: parserOptions})
}
