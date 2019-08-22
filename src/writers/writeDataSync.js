/* istanbul ignore next */
import fs from 'fs'
/* istanbul ignore next */
import discernFileFormatter from '../helpers/discernFileFormatter'
import makeDirectoriesSync from '../helpers/makeDirectoriesSync'
import omit from '../utils/omit'
import warnIfEmpty from '../utils/warnIfEmpty'

/**
 * Syncronous version of {@link writers#writeData}
 *
 * Supports the same formats with the exception of `.dbf` files
 *
 * @function writeDataSync
 * @param {String} filePath Input file path
 * @param {Array|Object|String} data Data to write
 * @param {Object} [options] Optional options object, see below
 * @param {Boolean} [options.makeDirectories=false] If `true`, create intermediate directories to your data file. Can also be `makeDirs` for short.
 * @param {Function|Array} [options.replacer] Used for JSON formats. Function to filter your objects before writing or an array of whitelisted keys to keep. Examples below. See JSON.stringify docs for more info https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
 * @param {Boolean} [options.verbose=true] Verbose logging output. Currently, the only logging output is a warning if you write an empty file. Set to `false` if don't want that.
 * @param {Number} [options.indent] Used for JSON format. Specifies indent level. Default is `0`.
 * @param {Array} [options.columns] Used for tabular formats. Optionally specify a list of column names to use. Otherwise they are detected from the data. See `d3-dsv` for more detail: https://github.com/d3/d3-dsv/blob/master/README.md#dsv_format
 * @returns {String} The that was written as a string
 *
 * @example
 * io.writeDataSync('path/to/data.json', jsonData)
 *
 * io.writeDataSync('path/to/create/to/data.csv', flatJsonData, {makeDirs: true})
 *
 * io.writeDataSync('path/to/to/data.json', jsonData, {indent: 4})
 *
 * io.writeDataSync('path/to/to/data.json', jsonData, {
 *   indent: 4,
 *   replacer: function (key, value) {
 *     // Filtering out string properties
 *     if (typeof value === "string") {
 *       return undefined
 *     }
 *     return value
 *   }
 * })
 *
 * io.writeDataSync('path/to/to/data.json', jsonData, {
 *   indent: 4,
 *   replacer: ['name', 'occupation'] // Only keep "name" and "occupation" values
 * })
 */
export default function writeDataSync (outPath, data, opts_) {
  warnIfEmpty(data, outPath, opts_)
  var writeOptions
  if (typeof opts_ === 'object') {
    if (opts_.makeDirectories === true || opts_.makeDirs === true) {
      makeDirectoriesSync(outPath)
    }
    writeOptions = opts_
  }
  opts_ = omit(opts_, ['makeDirectories', 'makeDirs'])
  var fileFormatter = discernFileFormatter(outPath)
  var formattedData = fileFormatter(data, writeOptions)
  fs.writeFileSync(outPath, formattedData)
  return formattedData
}
