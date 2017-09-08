import fs from 'fs'
import getParser from '../helpers/getParser'
import discernParser from '../helpers/discernParser'
import discernFormat from '../helpers/discernFormat'
import {formatsIndex} from '../config/equivalentFormats'
import _ from 'underscore'

/**
 * Asynchronously read data given a path ending in the file format.
 *
 * Supported formats / extensions:
 *
 * * `.json` Array of objects
 * * `.csv` Comma-separated
 * * `.tsv` Tab-separated
 * * `.psv` Pipe-separated
 * * `.yaml` or `.yml` Yaml file
 * * `.aml` ArchieML
 * * `.txt` Text file (a string)
 * * other All others are read as a text file
 *
 * *Note: Does not currently support `.dbf` files. `.yaml` and `.yml` formats are read with js-yaml's `.load` method, which has no security checking. See js-yaml library for more secure options.*
 *
 * @param {String} fileName the name of the file
 * @param {Object|Function} [parserOptions] Optional. Set this as a function as a shorthand for `map`.
 * @param {String|Function|Object} [parserOptions.parser] optional This can be a string that is the file's delimiter or a function that returns the json. See `parsers` in library source for examples. For convenience, this can also take a dsv object such as `dsv.dsv('_')` or any object that has a `parse` method.
 * @param {Function} [parserOptions.map] Transformation function. Takes `(fileString, parserOptions)` where `parserOptions` is the hash you pass in minus the `parser` key. See {@link shorthandReaders} for specifics.
 * @param {Function} [parserOptions.reviver] Used in {@link shorthandReaders.readJson}. Otherwise ignored.
 * @param {Function} [parserOptions.filename] Used in {@link shorthandReaders.readJson}. Otherwise ignored.
 * @param {Function} callback callback used when read data is read, takes error (if any) and the data read
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
 * // Parser specified with an object that has a `parse` function
 * var naiveJsonLines = {
 *   parse: function (dataAsString) {
 *     return dataAsString.split('\n').map(function (row) { return JSON.parse(row) })
 *   }
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
      delete opts_.parser
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
  fs.readFile(filePath, 'utf8', function (err, data) {
    var fileFormat = discernFormat(filePath)
    if ((fileFormat === 'json' || formatsIndex.json.indexOf(fileFormat) > -1) && data === '') {
      data = '[]'
    }
    if (err) {
      cb(err)
      return false
    }
    var parsed
    try {
      if (typeof parser === 'function') {
        parsed = parser(data, parserOptions)
      } else if (typeof parser === 'object' && typeof parser.parse === 'function') {
        parsed = parser.parse(data, parserOptions)
      } else {
        parsed = 'Your specified parser is not properly formatted. It must either be a function or have a `parse` method.'
      }
    } catch (err) {
      cb(err)
      return
    }
    cb(null, parsed)
  })
}
