import readData from '../readers/readData'
import parserTxt from '../parsers/txt'

/**
 * Asynchronously read a text file. Returns an empty string if file is empty.
 *
 * @param {String} fileName the name of the file
 * @param {Function} [map] Optional map function, take the file and returns any mapped value
 * @param {Function} callback callback used when read data is read, takes error (if any) and the data read
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
export default function readTxt (path, opts_, cb) {
  var parserOptions
  if (typeof cb === 'undefined') {
    cb = opts_
  } else {
    parserOptions = typeof opts_ === 'function' ? {map: opts_} : opts_
  }
  readData(path, {parser: parserTxt, parserOptions: parserOptions}, cb)
}
