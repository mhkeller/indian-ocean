import readData from '../readers/readData'
import parserCsv from '../parsers/csv'

/**
 * Asynchronously read a comma-separated value file. Returns an empty array if file is empty.
 *
 * @function readCsv
 * @param {String} fileName the name of the file
 * @param {Function} [map] Optional map function, called once for each row (header row skipped). Has signature `(row, i, columns)`. See example below or d3-dsv documentation for details.
 * @param {Function} callback callback used when read data is read, takes error (if any) and the data read
 *
 * @example
 * io.readCsv('path/to/data.csv', function (err, data) {
 *   console.log(data) // Json data
 * })
 *
 * // Transform values on load
 * io.readCsv('path/to/data.csv', function (row, i, columns) {
 *   console.log(columns) // [ 'name', 'occupation', 'height' ]
 *   row.height = +row.height // Convert this value to a number
 *   return row
 * }, function (err, data) {
 *   console.log(data) // Converted json data
 * })
 */
export default function readCsv (path, opts_, cb) {
  var parserOptions
  if (typeof cb === 'undefined') {
    cb = opts_
  } else {
    parserOptions = typeof opts_ === 'function' ? {map: opts_} : opts_
  }
  readData(path, {parser: parserCsv, parserOptions: parserOptions}, cb)
}
