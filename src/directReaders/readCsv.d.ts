/**
 * Asynchronously read a comma-separated value file. Returns an empty array if file is empty.
 *
 * @function readCsv
 * @param {String} filePath Input file path
 * @param {Function|Object} [parserOptions] Optional map function or an object specifying the optional options below.
 * @param {Function} [parserOptions.map] Map function. Called once for each row if your file is an array (it tests if the first non-whitespace character is a `[`) with a callback signature `(row, i)` and delegates to `_.map`. Otherwise it's considered an object and the callback the signature is `(value, key)` and delegates to `_.mapObject`. See example below.
 * @param {Boolean} [parserOptions.trim=true] Trim any whitespace from the file before parsing. Default is true.
 * @param {Function} callback Has signature `(err, data)`
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
 *
 * // Pass in an object with a `map` key
 * io.readCsv('path/to/data.csv', {map: function (row, i, columns) {
 *   console.log(columns) // [ 'name', 'occupation', 'height' ]
 *   row.height = +row.height // Convert this value to a number
 *   return row
 * }}, function (err, data) {
 *   console.log(data) // Converted json data
 * })
 */
export default function readCsv(filePath: string, opts_: any, cb: any): void;
