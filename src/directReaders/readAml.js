import readData from '../readers/readData'
import parserAml from '../parsers/aml'

/**
 * Asynchronously read an ArchieMl file. Returns an empty object if file is empty.
 *
 * @function readAml
 * @param {String} filePath Input file path
 * @param {Function|Object} [map] Optional map function or an object with `map` key that is a function. Takes the parsed file (usually an object) and must return the modified file. See example below.
 * @param {Function} callback Has signature `(err, data)`
 *
 * @example
 * io.readAml('path/to/data.aml', function (err, data) {
 *   console.log(data) // json data
 * })
 *
 * // With map
 * io.readAml('path/to/data.aml', function (amlFile) {
 *   amlFile.height = amlFile.height * 2
 *   return amlFile
 * }, function (err, data) {
 *   console.log(data) // json data with height multiplied by 2
 * })
 */
export default function readAml (filePath, opts_, cb) {
  var parserOptions
  if (typeof cb === 'undefined') {
    cb = opts_
  } else {
    parserOptions = typeof opts_ === 'function' ? {map: opts_} : opts_
  }
  readData(filePath, {parser: parserAml, parserOptions: parserOptions}, cb)
}
