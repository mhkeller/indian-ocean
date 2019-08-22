/* istanbul ignore next */
import _ from 'underscore'
import getParser from '../helpers/getParser'
import discernParser from '../helpers/discernParser'
import discernLoader from '../helpers/discernLoader'
import omit from '../utils/omit'

/**
 * Syncronous version of {@link readData}. Read data given a path ending in the file format. This function detects the same formats as the asynchronous {@link readData} except for `.dbf` files, which it cannot read.
 *
 * * `.json` Array of objects or object
 * * `.csv` Comma-separated
 * * `.tsv` Tab-separated
 * * `.psv` Pipe-separated
 * * `.aml` ArchieML
 * * `.txt` Text file (a string)
 * * other All others are read as a text file
 *
 * @function readDataSync
 * @param {String} filePath Input file path
 * @param {Function|Object} [parserOptions] Optional map function or an object specifying the optional options below.
 * @param {String|Function|Object} [parserOptions.parser] This can be a string that is the file's delimiter, a function that returns JSON, or, for convenience, can also be a dsv object such as `dsv.dsv('_')` or any object that has a `parse` method that's a function. See `parsers` in library source for examples.
 * @param {Function} [parserOptions.map] Transformation function. See {@link directReaders} for format-specific function signature. In brief, tabular formats get passed a `(row, i, columns)` and must return the modified row. Text or AML formats are passed the full document and must return the modified document. JSON arrays are mapped like tabular documents with `(row, i)` and return the modified row. JSON objects are mapped with Underscore's `_.mapObject` with `(value, key)` and return the modified value.
 * @param {Function} [parserOptions.reviver] Used for JSON files, otherwise ignored. See {@link readJsonSync} for details.
 * @param {Function} [parserOptions.filename] Used for JSON files, otherwise ignored. See {@link readJsonSync} for details.
 * @returns {Object} the contents of the file as JSON
 *
 * @example
 * var data = io.readDataSync('path/to/data.tsv')
 * console.log(data) // Json data
 *
 * // Parser specified as a string
 * var data = io.readDataSync('path/to/data.usv', {parser: '_'})
 * console.log(data) // Json data
 *
 * // Parser specified as a function
 * var myParser = dsv.dsv('_').parse
 * // var myParser = dsv.dsv('_') // This also works
 * var data = io.readDataSync('path/to/data.usv', {parser: myParser})
 * console.log(data) // Json data
 *
 * // Parser as an object with a `parse` method
 * var naiveJsonLines = function(dataAsString) {
 *   return dataAsString.split('\n').map(function (row) { return JSON.parse(row) })
 * }
 * var data = io.readDataSync('path/to/data.jsonlines', {parser: naiveJsonLines})
 * console.log(data) // Json data
 *
 * // Shorthand for specifying a map function
 * var data = io.readData('path/to/data.csv', function (row, i, columns) {
 *   console.log(columns) // [ 'name', 'occupation', 'height' ]
 *   row.height = +row.height // Convert this value to a number
 *   return row
 * })
 * console.log(data) // Json data
 *
 * // Explicitly specify a map function and a filename for a json file. See `readJson` for more details
 * var data = io.readData('path/to/data.json', {
 *   map: function (k, v) {
 *     if (typeof v === 'number') {
 *       return v * 2
 *     }
 *     return v
 *   },
 *   filename: 'awesome-data.json'
 * })
 * console.log(data) // Json data with any number values multiplied by two and errors reported with `fileName`
 */
export default function readDataSync (filePath, opts_) {
  var parser
  var parserOptions
  if (arguments.length === 2) {
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
  var loader = discernLoader(filePath, {sync: true})
  return loader(filePath, parser, parserOptions)
}
