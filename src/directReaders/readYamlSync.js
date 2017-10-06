import readDataSync from '../readers/readDataSync'
import parserYaml from '../parsers/yaml'

/**
 * Synchronously read a yaml file. Returns an empty object if file is empty. `parseOptions` will pass any other optinos directl to js-yaml library. See its documentation for more detail https://github.com/nodeca/js-yaml
 *
 * @function readYamlSync
 * @param {String} filePath Input file path
 * @param {Function|Object} [parserOptions] Optional map function or an object specifying the optional options below.
 * @param {Function} [parserOptions.map] Optional map function. Called once for each row (header row skipped). If your file is an array (it tests if first non-whitespace character is a `[`), the callback has the signature `(row, i)` and delegates to `_.map`. Otherwise it's considered an object and the callback has the signature `(value, key)` and delegates to `_.mapObject`. See example below.
 * @param {String} [parserOptions.loadMethod="safeLoad"] The js-yaml library allows you to specify a more liberal `"load"` method which will accept RegExp and function values in your file.
 * @returns {Array|Object} the contents of the file as a string
 *
 * @example
 * // Can be `.yaml` or `.yml` extension
 * var data = io.readYamlSync('path/to/data.yaml')
 * console.log(data) // json data
 *
 * // With map function
 * var data = io.readYaml('path/to/data.yaml', function (yamlFile) {
 *   yamlFile.height = yamlFile.height * 2
 *   return yamlFile
 * })
 * console.log(data) // json data with `height` values doubled
 *
 * // With map function and load settings
 * var data = io.readYaml('path/to/data.yaml', {
 *   loadMethod: 'load',
 *   map: function (yamlFile) {
 *     yamlFile.height = yamlFile.height * 2
 *     return yamlFile
 *   }
 * })
 * console.log(data) // json data with `height` values doubled
 */
export default function readYamlSync (filePath, opts_) {
  var parserOptions
  if (typeof opts_ !== 'undefined') {
    parserOptions = typeof opts_ === 'function' ? {map: opts_} : opts_
  }
  return readDataSync(filePath, {parser: parserYaml, parserOptions: parserOptions})
}
