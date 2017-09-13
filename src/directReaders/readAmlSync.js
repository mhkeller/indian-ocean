import readDataSync from '../readers/readDataSync'
import parserAml from '../parsers/aml'

/**
 * Synchronously read an ArchieML file. Returns an empty TK if file is empty.
 *
 * @function readAmlSync
 * @param {String} fileName the name of the file
 * @param {Function} [map] Optional map function. Takes the parsed filed, return modified file. See example below.
 * @returns {Object} the contents of the file as a string
 *
 * @example
 * var data = io.readAmlSync('path/to/data.aml')
 * console.log(data) // json data
 *
 * var data = io.readAmlSync('path/to/data-with-comments.aml', function (amlFile) {
 *   amlFile.height = amlFile.height * 2
 *   return amlFile
 * })
 * console.log(data) // json data with height multiplied by 2
 */
export default function readAmlSync (path, opts_) {
  var parserOptions
  if (typeof opts_ !== 'undefined') {
    parserOptions = typeof opts_ === 'function' ? {map: opts_} : opts_
  }
  return readDataSync(path, {parser: parserAml, parserOptions: parserOptions})
}
