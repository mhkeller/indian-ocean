import readDataSync from '../readers/readDataSync'
import parserAml from '../parsers/aml'

/**
 * Synchronously read an ArchieML file. Returns an empty object if file is empty.
 *
 * @function readAmlSync
 * @param {String} filePath Input file path
 * @param {Function} [map] Optional map function. Takes the parsed file (usually an object) and must return the modified file. See example below.
 * @returns {Object} The parsed file
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
export default function readAmlSync (filePath, opts_) {
  var parserOptions
  if (typeof opts_ !== 'undefined') {
    parserOptions = typeof opts_ === 'function' ? {map: opts_} : opts_
  }
  return readDataSync(filePath, {parser: parserAml, parserOptions: parserOptions})
}
