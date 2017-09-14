import readDataSync from '../readers/readDataSync'
import parserJson from '../parsers/json'

/**
 * Synchronously read a JSON file. Returns an empty array if file is empty.
 *
 * @function readJsonSync
 * @param {String} filePath Input file path
 * @param {Function|Object} [parserOptions] Optional map function or an object specifying the optional options below.
 * @param {Function} [parserOptions.map] Map function. Called once for each row if your file is an array (it tests if the first non-whitespace character is a `[`) with a callback signature `(row, i)` and delegates to `_.map`. Otherwise it's considered an object and the callback the signature is `(value, key)` and delegates to `_.mapObject`. See example below.
 * @param {String} [parserOptions.filename] File name displayed in the error message.
 * @param {Function} [parserOptions.reviver] A function that prescribes how the value originally produced by parsing is mapped before being returned. See JSON.parse docs for more: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse#Using_the_reviver_parameter
 * @returns {Array|Object} The contents of the file as JSON
 *
 * @example
 * var data = io.readJsonSync('path/to/data.json')
 * console.log(data) // Json data
 *
 * // Specify a map
 * var data = io.readJson('path/to/data.json', function (k, v) {
 *   if (typeof v === 'number') {
 *     return v * 2
 *   }
 *   return v
 * })
 * console.log(data) // Json data with any number values multiplied by two
 *
 * // Specify a filename
 * var data = io.readJson('path/to/data.json', 'awesome-data.json')
 * console.log(data) // Json data, any errors are reported with `fileName`.
 *
 * // Specify a map and a filename
 * var data = io.readJsonSync('path/to/data.json', {
 *   map: function (k, v) {
 *     if (typeof v === 'number') {
 *       return v * 2
 *     }
 *     return v
 *   },
 *   filename: 'awesome-data.json'
 * })
 *
 * console.log(data) // Json data with any number values multiplied by two and errors reported with `fileName`
 */
export default function readJsonSync (filePath, opts_) {
  var parserOptions
  if (typeof opts_ !== 'undefined') {
    parserOptions = typeof opts_ === 'function' ? {map: opts_} : opts_
  }
  return readDataSync(filePath, {parser: parserJson, parserOptions: parserOptions})
}
