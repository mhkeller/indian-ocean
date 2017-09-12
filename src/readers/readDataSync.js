import fs from 'fs'
import getParser from '../helpers/getParser'
import discernParser from '../helpers/discernParser'
import discernFormat from '../helpers/discernFormat'
import {formatsIndex} from '../config/equivalentFormats'
import _ from 'underscore'

/**
 * Syncronous version of {@link readers#readData}
 *
 * @function readDataSync
 * @param {String} fileName the name of the file
 * @param {Function|Object} [parserOptions] Can be a map function, or an object specifying other options.
 * @param {String|Function|Object} [parserOptions.parser] optional This can be a string that is the file's delimiter or a function that returns the json. See `parsers` in library source for examples. For convenience, this can also take a dsv object such as `dsv.dsv('_')` or any object that has a `parse` method that's a function.
 * @param {Function} [parserOptions.map] Transformation function. Takes `(fileString, options)` where `options` is the hash you pass in minus the `parser` key. See {@link shorthandReaders} for specifics.
 * @param {Function} [parserOptions.reviver] Used in {@link shorthandReaders.readJson}. Otherwise ignored.
 * @param {Function} [parserOptions.filename] Used in {@link shorthandReaders.readJson}. Otherwise ignored.
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
  var data = fs.readFileSync(filePath, 'utf8')
  var fileFormat = discernFormat(filePath)
  if ((fileFormat === 'json' || formatsIndex.json.indexOf(fileFormat) > -1) && data === '') {
    data = '[]'
  }

  var parsed
  if (typeof parser === 'function') {
    parsed = parser(data, parserOptions)
  } else if (typeof parser === 'object' && typeof parser.parse === 'function') {
    parsed = parser.parse(data, parserOptions)
  } else {
    return new Error('Your specified parser is not properly formatted. It must either be a function or have a `parse` method.')
  }

  // if (opts_ && opts_.flatten) {
  //   parsed = _.map(parsed, flatten)
  // }
  return parsed
}
