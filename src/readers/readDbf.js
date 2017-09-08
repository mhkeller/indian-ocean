var shapefile = require('shapefile')
import identity from '../utils/identity'

/**
 * Asynchronously read a dbf file. Returns an empty array if file is empty.
 *
 * @param {String} fileName the name of the file
 * @param {Function|Object} [map] Optional map function or object with `map` key that is a function, called once for each row (header row skipped). Has signature `(row)`. See example below.
 * @param {Function} callback callback used when read data is read, takes error (if any) and the data read
 *
 * @example
 * io.readDbf('path/to/data.dbf', function (err, data) {
 *   console.log(data) // Json data
 * })
 *
 * // Transform values on load
 * io.readDbf('path/to/data.csv', function (row, i, columns) {
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
