import readData from '../readers/readData'
import parserJson from '../parsers/json'

/**
 * Asynchronously read a JSON file. Returns an empty array if file is empty.
 *
 * @function readJson
 * @param {String} filePath Input file path
 * @param {Function|Object} [parserOptions] Optional map function or an object specifying the optional options below.
 * @param {Function} [parserOptions.map] Map function. Called once for each row if your file is an array (it tests if the first non-whitespace character is a `[`) with a callback signature `(row, i)` and delegates to `_.map`. Otherwise it's considered an object and the callback the signature is `(value, key)` and delegates to `_.mapObject`. See example below.
 * @param {String} [parserOptions.filename] File name displayed in the error message.
 * @param {Function} [parserOptions.reviver] A function that prescribes how the value originally produced by parsing is mapped before being returned. See JSON.parse docs for more: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse#Using_the_reviver_parameter
 * @param {Function} callback Has signature `(err, data)`
 *
 * @example
 * io.readJson('path/to/data.json', function (err, data) {
 *   console.log(data) // Json data
 * })
 *
 * // Specify a map
 * io.readJson('path/to/data.json', function (row, i) {
 *   row.height = row.height * 2
 *   return row
 * }, function (err, data) {
 *   console.log(data) // Json data with height multiplied by two
 * })
 *
 * // Specify a filename
 * io.readJson('path/to/data.json', 'awesome-data.json', function (err, data) {
 *   console.log(data) // Json data, any errors are reported with `fileName`.
 * })
 *
 * // Specify a map and a filename
 * io.readJson('path/to/data.json', {
 *   map: function (row, i) {
 *     row.height = row.height * 2
 *     return row
 *   },
 *   filename: 'awesome-data.json'
 * }, function (err, data) {
 *   console.log(data) // Json data with any number values multiplied by two and errors reported with `fileName`
 * })
 *
 * // Specify a map and a filename on json object
 * io.readJson('path/to/json-object.json', {
 *   map: function (value, key) {
 *     if (typeof value === 'number') {
 *       return value * 2
 *     }
 *     return value
 *   },
 *   filename: 'awesome-data.json'
 * }, function (err, data) {
 *   console.log(data) // Json data with any number values multiplied by two and errors reported with `fileName`
 * })
 *
 * // Specify a reviver function and a filename
 * io.readJson('path/to/data.json', {
 *   reviver: function (k, v) {
 *     if (typeof v === 'number') {
 *       return v * 2
 *     }
 *     return v
 *   },
 *   filename: 'awesome-data.json'
 * }, function (err, data) {
 *   console.log(data) // Json data with any number values multiplied by two and errors reported with `fileName`
 * })
 */
export default function readJson (filePath, opts_, cb) {
  var parserOptions
  if (typeof cb === 'undefined') {
    cb = opts_
  } else {
    parserOptions = typeof opts_ === 'function' ? {map: opts_} : opts_
  }
  readData(filePath, {parser: parserJson, parserOptions: parserOptions}, cb)
}
