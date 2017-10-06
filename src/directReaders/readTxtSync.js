import readDataSync from '../readers/readDataSync'
import parserTxt from '../parsers/txt'

/**
 * Synchronously read a text file. Returns an empty string if file is empty.
 *
 * @function readTxtSync
 * @param {String} filePath Input file path
 * @param {Function|Object} [map] Optional map function or an object with `map` key that is a function. Takes the file read in as text and must return the modified file. See example below.
 * @returns {String} the contents of the file as a string
 *
 * @example
 * var data = io.readTxtSync('path/to/data.txt')
 * console.log(data) // string data
 *
 * var data = io.readTxtSync('path/to/data.txt', function (str) {
 *   return str.replace(/hello/g, 'goodbye') // Replace all instances of `"hello"` with `"goodbye"`
 * })
 * console.log(data) // string data with values replaced
 */
export default function readTxtSync (filePath, opts_) {
  var parserOptions
  if (typeof opts_ !== 'undefined') {
    parserOptions = typeof opts_ === 'function' ? {map: opts_} : opts_
  }
  return readDataSync(filePath, {parser: parserTxt, parserOptions: parserOptions})
}
