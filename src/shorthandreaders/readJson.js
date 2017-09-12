import readData from '../readers/readData'
import parserJson from '../parsers/json'

/**
 * Asynchronously read a JSON file. Returns an empty array if file is empty.
 *
 * @function readJson
 * @param {String} fileName the name of the file
 * @param {Function|Object} [parserOptions] Can be a map function, or an object specifying other options.
 * @param {Function} [parserOptions.map] Optional map function, called once for each row (header row skipped). If your file is an array (tests if first non-whitespace character is a `[`), has signature `(row, i)`, delegates to `_.map`. If file is an object has signature `(value, key)`, delegates to `_.mapObject`. See example below.
 * @param {String} [parserOptions.filename] Filename displayed in the error message.
 * @param {String} [parserOptions.reviver] Prescribes how the value originally produced by parsing is mapped, before being returned. See JSON.parse docs for more: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse#Using_the_reviver_parameter
 * @param {Function} callback Function invoked after data is read, takes error (if any) and the data read
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
export default function readJson (path, opts_, cb) {
  var parserOptions
  if (typeof cb === 'undefined') {
    cb = opts_
  } else {
    parserOptions = typeof opts_ === 'function' ? {map: opts_} : opts_
  }
  readData(path, {parser: parserJson, parserOptions: parserOptions}, cb)
}
