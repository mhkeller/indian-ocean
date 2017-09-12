import readData from '../readers/readData'
import parserYaml from '../parsers/yaml'

/**
 * Asynchronously read a yaml file. Returns an empty object if file is empty. `parseOptions` will pass any other optinos directl to js-yaml library. See its documentation for more detail https://github.com/nodeca/js-yaml
 *
 * @function readYaml
 * @param {String} fileName the name of the file
 * @param {Function|Object} [parserOptions] Can be a map function or an object specifying that or other options.
 * @param {Function} [parserOptions.map] Optional map function. Takes the parsed filed, return modified file. See example below.
 * @param {String} [parserOptions.loadMethod="safeLoad"] The js-yaml library allows you to specify a more liberal `load` method which will accept regex and function values.
 * @param {Function} callback callback used when read data is read, takes error (if any) and the data read
 *
 * @example
 * // Can be `.yaml` or `.yml` extension
 * io.readYaml('path/to/data.yaml', function (err, data) {
 *   console.log(data) // json data
 * })
 *
 * // With map function shorthand on an object
 * io.readYaml('path/to/data.yaml', function (yamlFile) {
 *   yamlFile.height = yamlFile.height * 2
 *   return yamlFile
 * }, function (err, data) {
 *   console.log(data) // json data with `height` values doubled
 * })
 *
 * // With map function on an object and load settings
 * io.readYaml('path/to/data.yaml', {
 *   loadMethod: 'load',
 *   map: function (value, key) {
 *     yamlFile.height = yamlFile.height * 2
 *     return yamlFile
 *   }
 * }, function (err, data) {
 *   console.log(data) // json data with `height` values doubled
 * })
 */
export default function readYaml (path, opts_, cb) {
  var parserOptions
  if (typeof cb === 'undefined') {
    cb = opts_
  } else {
    parserOptions = typeof opts_ === 'function' ? {map: opts_} : opts_
  }
  readData(path, {parser: parserYaml, parserOptions: parserOptions}, cb)
}
