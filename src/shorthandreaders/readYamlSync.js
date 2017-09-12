import readDataSync from '../readers/readDataSync'
import parserYaml from '../parsers/yaml'

/**
 * Synchronously read a yaml file. Returns an empty object if file is empty. `parseOptions` will pass any other optinos directl to js-yaml library. See its documentation for more detail https://github.com/nodeca/js-yaml
 *
 * @function readYamlSync
 * @param {String} fileName the name of the file
 * @param {Function|Object} [parserOptions] Can be a map function or an object specifying that or other options.
 * @param {Function} [parserOptions.map] Optional map function. Takes the parsed filed, return modified file. See example below.
 * @param {String} [parserOptions.loadMethod="safeLoad"] The js-yaml library allows you to specify a more liberal `load` method which will accept regex and function values.
 * @returns {Array} the contents of the file as a string
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
export default function readYamlSync (path, opts_) {
  var parserOptions
  if (typeof opts_ !== 'undefined') {
    parserOptions = typeof opts_ === 'function' ? {map: opts_} : opts_
  }
  return readDataSync(path, {parser: parserYaml, parserOptions: parserOptions})
}
