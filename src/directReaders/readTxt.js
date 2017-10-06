import readData from '../readers/readData'
import parserTxt from '../parsers/txt'

/**
 * Asynchronously read a text file. Returns an empty string if file is empty.
 *
 * @function readTxt
 * @param {String} filePath Input file path
 * @param {Function|Object} [map] Optional map function or an object with `map` key that is a function. Takes the file read in as text and return the modified file. See example below.
 * @param {Function} callback Has signature `(err, data)`
 *
 * @example
 * io.readTxt('path/to/data.txt', function (err, data) {
 *   console.log(data) // string data
 * })
 *
 * io.readTxt('path/to/data.txt', function (str) {
 *   return str.replace(/hello/g, 'goodbye') // Replace all instances of `"hello"` with `"goodbye"`
 * }, function (err, data) {
 *   console.log(data) // string data with values replaced
 * })
 */
export default function readTxt (filePath, opts_, cb) {
  var parserOptions
  if (typeof cb === 'undefined') {
    cb = opts_
  } else {
    parserOptions = typeof opts_ === 'function' ? {map: opts_} : opts_
  }
  readData(filePath, {parser: parserTxt, parserOptions: parserOptions}, cb)
}
