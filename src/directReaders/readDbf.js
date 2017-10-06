import identity from '../utils/identity'
import readData from '../readers/readData'

/**
 * Asynchronously read a dbf file. Returns an empty array if file is empty.
 *
 * @function readDbf
 * @param {String} filePath Input file path
 * @param {Function|Object} [map] Optional map function or an object with `map` key that is a function. Called once for each row with the signature `(row, i)` and must return the transformed row. See example below.
 * @param {Function} callback Has signature `(err, data)`
 *
 * @example
 * io.readDbf('path/to/data.dbf', function (err, data) {
 *   console.log(data) // Json data
 * })
 *
 * // Transform values on load
 * io.readDbf('path/to/data.csv', function (row, i) {
 *   console.log(columns) // [ 'name', 'occupation', 'height' ]
 *   row.height = +row.height // Convert this value to a number
 *   return row
 * }, function (err, data) {
 *   console.log(data) // Converted json data
 * })
 */
export default function readDbf (filePath, opts_, cb) {
  var parserOptions = {
    map: identity
  }
  if (typeof cb === 'undefined') {
    cb = opts_
  } else {
    parserOptions = typeof opts_ === 'function' ? {map: opts_} : opts_
  }
  readData(filePath, parserOptions, cb)
}
