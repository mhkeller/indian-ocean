import readDataSync from '../readers/readDataSync'
import parserJson from '../parsers/json'

/**
 * Synchronously read a JSON file. Returns an empty array if file is empty.
 *
 * @param {String} fileName the name of the file
 * @param {Function|Object} [parserOptions] Can be a map function, or an object specifying other options.
 * @param {Function} [parserOptions.map] Optional map function, called once for each row (header row skipped). If your file is an array (tests if first non-whitespace character is a `[`), has signature `(row, i)`, delegates to `_.map`. If file is an object has signature `(value, key)`, delegates to `_.mapObject`. See example below.
 * @param {Function} [parserOptions.comments] Used in {@link shorthandReaders.readAml}. Otherwise ignored.
 * @param {String} [parserOptions.filename] Filename displayed in the error message.
 * @param {String} [parserOptions.reviver] Prescribes how the value originally produced by parsing is mapped, before being returned. See JSON.parse docs for more: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse#Using_the_reviver_parameter
 * @returns {Array} the contents of the file as JSON
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
export default function readJsonSync (path, opts_) {
  var parserOptions
  if (typeof opts_ !== 'undefined') {
    parserOptions = typeof opts_ === 'function' ? {map: opts_} : opts_
  }
  return readDataSync(path, {parser: parserJson, parserOptions: parserOptions})
}
