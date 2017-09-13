import readData from '../readers/readData'
import parserTsv from '../parsers/tsv'

/**
 * Asynchronously read a tab-separated value file. Returns an empty array if file is empty.
 *
 * @function readTsv
 * @param {String} filePath Input file path
 * @param {Function} [map] Optional map function, called once for each row (header row skipped). Has signature `(row, i, columns)`. See example below or d3-dsv documentation for details.
 * @param {Function} callback callback used when read data is read, takes error (if any) and the data read
 *
 * @example
 * io.readTsv('path/to/data.tsv', function (err, data) {
 *   console.log(data) // Json data
 * })
 *
 * // Transform values on load
 * io.readTsv('path/to/data.tsv', function (row, i, columns) {
 *     console.log(columns) // [ 'name', 'occupation', 'height' ]
 *     row.height = +row.height // Convert this value to a number
 *     return row
 * }, function (err, data) {
 *   console.log(data) // Json data with casted values
 * })
 */
export default function readTsv (path, opts_, cb) {
  var parserOptions
  if (typeof cb === 'undefined') {
    cb = opts_
  } else {
    parserOptions = typeof opts_ === 'function' ? {map: opts_} : opts_
  }
  readData(path, {parser: parserTsv, parserOptions: parserOptions}, cb)
}
