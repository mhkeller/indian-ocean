var shapefile = require('shapefile')
import identity from '../utils/identity'

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
  var values = []
  shapefile.openDbf(filePath)
    .then(source => source.read()
      .then(function log (result) {
        if (result.done) return cb(null, values)
        values.push(parserOptions.map(result.value)) // TODO, figure out i
        return source.read().then(log)
      }))
    .catch(error => cb(error.stack))
}
