/* istanbul ignore next */
import _ from 'underscore'
import getParser from '../helpers/getParser'
import discernLoader from '../helpers/discernLoader'
import discernParser from '../helpers/discernParser'
import omit from '../utils/omit'

/**
 * Asynchronously read data given a path ending in the file format.
 *
 * Supported formats / extensions:
 *
 * * `.json` Array of objects or object
 * * `.csv` Comma-separated
 * * `.tsv` Tab-separated
 * * `.psv` Pipe-separated
 * * `.aml` ArchieML
 * * `.txt` Text file (a string)
 * * `.dbf` Database format used for shapefiles
 * * other All others are read as a text file
 *
 * @function readData
 * @param {String} filePath Input file path
 * @param {Function|Object} [parserOptions] Optional map function or an object specifying the optional options below.
 * @param {String|Function|Object} [parserOptions.parser] This can be a string that is the file's delimiter, a function that returns JSON, or, for convenience, can also be a dsv object such as `dsv.dsv('_')` or any object that has a `parse` method that's a function. See `parsers` in library source for examples.
 * @param {Function} [parserOptions.map] Transformation function. See {@link directReaders} for format-specific function signature. In brief, tabular formats get passed a `(row, i, columns)` and must return the modified row. Text or AML formats are passed the full document and must return the modified document. JSON arrays are mapped like tabular documents with `(row, i)` and return the modified row. JSON objects are mapped with Underscore's `_.mapObject` with `(value, key)` and return the modified value.
 * @param {Function} [parserOptions.reviver] Used for JSON files, otherwise ignored. See {@link readJson} for details.
 * @param {Function} [parserOptions.filename] Used for JSON files, otherwise ignored. See {@link readJson} for details.
 * @param {Function} callback Has signature `(err, data)`
 *
 * @example
 * io.readData('path/to/data.tsv', function (err, data) {
 *   console.log(data) // Json data
 * })
 *
 * // Parser specified as a string
 * io.readData('path/to/data.usv', {parser: '_'}, function (err, data) {
 *   console.log(data) // Json data
 * })
 *
 * // Parser specified as a function
 * var myParser = dsv.dsv('_').parse
 * // var myParser = dsv.dsv('_') // This also works
 * io.readData('path/to/data.usv', {parser: myParser}, function (err, data) {
 *   console.log(data) // Json data
 * })
 *
 * // Parser specified as a function
 * var naiveJsonLines = function (dataAsString) {
 *   return dataAsString.split('\n').map(function (row) { return JSON.parse(row) })
 * }
 * io.readData('path/to/data.jsonlines', {parser: naiveJsonLines}, function (err, data) {
 *   console.log(data) // Json data
 * })
 *
 * // Shorthand for specifying a map function
 * io.readData('path/to/data.csv', function (row, i, columns) {
 *   console.log(columns) // [ 'name', 'occupation', 'height' ]
 *   row.height = +row.height // Convert this value to a number
 *   return row
 * }, function (err, data) {
 *   console.log(data) // Json data
 * })
 *
 * // Explicitly specify a map function and a filename for a json file. See `readJson` for more details
 * io.readData('path/to/data.json', {
 *   map: function (k, v) {
 *     if (typeof v === 'number') {
 *       return v * 2
 *     }
 *     return v
 *   },
 *   filename: 'awesome-data.json'
 * }, function (err, data) {
 *   console.log(data) // Json data with any number values multiplied by two and errors reported with `fileName`
 * })
 */
export default function readData (filePath, opts_, cb_) {
  var cb = arguments[arguments.length - 1]
  var parser
  var parserOptions
  if (arguments.length === 3) {
    if (opts_.parser) {
      parser = getParser(opts_.parser)
      opts_ = omit(opts_, ['parser'])
      if (_.isEmpty(opts_)) {
        opts_ = undefined
      }
    } else {
      parser = discernParser(filePath)
    }

    if (opts_ && opts_.parserOptions) {
      if (typeof opts_.parserOptions === 'function') {
        parserOptions = {map: opts_.parserOptions}
      } else {
        parserOptions = opts_.parserOptions
      }
    } else if (opts_) {
      if (typeof opts_ === 'function') {
        parserOptions = {map: opts_}
      } else {
        parserOptions = opts_
      }
    }
  } else {
    parser = discernParser(filePath)
  }
  var loader = discernLoader(filePath)
  loader(filePath, parser, parserOptions, cb)
}
