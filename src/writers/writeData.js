/* istanbul ignore next */
import fs from 'fs'
/* istanbul ignore next */
import discernFileFormatter from '../helpers/discernFileFormatter'
import makeDirectories from '../helpers/makeDirectories'
import omit from '../utils/omit'
import warnIfEmpty from '../utils/warnIfEmpty'

/**
 * Write the data object, inferring the file format from the file ending specified in `fileName`.
 *
 * Supported formats:
 *
 * * `.json` Array of objects, also supports `.geojson` and `.topojson`
 * * `.csv` Comma-separated
 * * `.tsv` Tab-separated
 * * `.psv` Pipe-separated
 * * `.dbf` Database file, commonly used in ESRI-shapefile format.
 *
 * @function writeData
 * @param {String} filePath Input file path
 * @param {Array|Object|String} data Data to write
 * @param {Object} [options] Optional options object, see below
 * @param {Boolean} [options.makeDirectories=false] If `true`, create intermediate directories to your data file. Can also be `makeDirs` for short.
 * @param {Function|Array} [options.replacer] Used for JSON formats. Function to filter your objects before writing or an array of whitelisted keys to keep. Examples below. See JSON.stringify docs for more info https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
 * @param {Boolean} [options.verbose=true] Verbose logging output. Currently, the only logging output is a warning if you write an empty file. Set to `false` if don't want that.
 * @param {Number} [options.indent] Used for JSON format. Specifies indent level. Default is `0`.
 * @param {Array} [options.columns] Used for tabular formats. Optionally specify a list of column names to use. Otherwise they are detected from the data. See `d3-dsv` for more detail: https://github.com/d3/d3-dsv/blob/master/README.md#dsv_format
 * @param {Function} callback Has signature `(err, dataStr)`. `dataStr` is the data that was written out as a string
 *
 * @example
 * io.writeData('path/to/data.json', jsonData, function (err, dataString) {
 *   console.log(err)
 * })
 *
 * io.writeData('path/to/create/to/data.csv', flatJsonData, {makeDirectories: true}, function (err, dataString) {
 *   console.log(err)
 * })
 *
 * io.writeData('path/to/to/data.json', jsonData, {indent: 4}, function (err, dataString) {
 *   console.log(err)
 * })
 *
 * io.writeData('path/to/to/data.json', jsonData, {
 *   indent: 4,
 *   replacer: function (key, value) {
 *     // Filtering out string properties
 *     if (typeof value === "string") {
 *       return undefined
 *     }
 *     return value
 *   }
 * }, function (err, dataString) {
 *   console.log(err)
 * })
 *
 * io.writeData('path/to/to/data.json', jsonData, {
 *   indent: 4,
 *   replacer: ['name', 'occupation'] // Only keep "name" and "occupation" values
 * }, function (err, dataString) {
 *   console.log(err)
 * })
 */
export default function writeData (outPath, data, opts_, cb) {
  if (typeof cb === 'undefined') {
    cb = opts_
    opts_ = undefined
  }
  warnIfEmpty(data, outPath, opts_)

  if (typeof opts_ === 'object' && (opts_.makeDirectories === true || opts_.makeDirs === true)) {
    makeDirectories(outPath, proceed)
  } else {
    proceed()
  }

  function proceed (err) {
    if (err) {
      throw err
    }

    opts_ = omit(opts_, ['makeDirectories', 'makeDirs'])
    var writeOptions
    if (typeof opts_ !== 'function') {
      writeOptions = opts_
    }

    var fileFormatter = discernFileFormatter(outPath)
    var formattedData = fileFormatter(data, writeOptions)
    fs.writeFile(outPath, formattedData, function (err) {
      cb(err, formattedData)
    })
  }
}
