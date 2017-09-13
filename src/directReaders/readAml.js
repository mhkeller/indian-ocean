import readData from '../readers/readData'
import parserAml from '../parsers/aml'

/**
 * Asynchronously read an ArchieMl file. Returns an empty object if file is empty.
 *
 * @function readAml
 * @param {String} fileName the name of the file.
 * @param {Function} [map] Optional map function. Takes the parsed filed, return modified file. See example below.
 * @param {Function} callback callback used when read data is read, takes error (if any) and the data read.
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
export default function readAml (path, opts_, cb) {
  var parserOptions
  if (typeof cb === 'undefined') {
    cb = opts_
  } else {
    parserOptions = typeof opts_ === 'function' ? {map: opts_} : opts_
  }
  readData(path, {parser: parserAml, parserOptions: parserOptions}, cb)
}
