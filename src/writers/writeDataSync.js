import fs from 'fs'
import _ from 'underscore'
import warn from '../reporters/warn'
import discernFileFormatter from '../helpers/discernFileFormatter'
import makeDirectoriesSync from '../helpers/makeDirectoriesSync'

/**
 * Syncronous version of {@link writers#writeData}
 *
 * Supports the same formats with the exception of `.dbf` files
 *
 * @param {String} fileName the name of the file
 * @param {Object} [options] Optional config object, see below
 * @param {Boolean} [options.makeDirectories=false] If true, create intermediate directories to your data file.
 * @param {Function|Array} [options.replacer] Used for JSON formats. Filter your objects before writing. Examples below. See JSON.stringify docs for more info https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
 * @param {Number} [options.indent] Used for JSON and YAML formats. Specifies indent level. Default for YAML is `2`, `0` for JSON.
 * @param {String} [options.writeMethod='safeDump'] Used for YAML formats. Can also be `"dump"` to allow writing of RegExes and functions. The `options` object will also pass anything onto `js-yaml`. See its docs for other options. Example shown below with `sortKeys`. https://github.com/nodeca/js-yaml#safedump-object---options-
 * @param {Array} [options.columns] Used for tabular formats. Optionally specify a list of column names to use. Otherwise they are detected from the data. See `d3-dsv` for more detail: https://github.com/d3/d3-dsv/blob/master/README.md#dsv_format
 * @param {Object} data the data to write
 * @returns {String} the data string that was written
 *
 * @example
 * io.writeDataSync('path/to/data.json', jsonData)
 *
 * io.writeDataSync('path/to/create/to/data.csv', flatJsonData, {makeDirectories: true})
 *
 * io.writeDataSync('path/to/to/data.yaml', jsonData, {writeMehod: "dump", sortKeys: true})
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
  if (_.isEmpty(data)) {
    warn('You didn\'t pass any data to write for file: `' + outPath + '`. Writing out an empty file...')
  }
  var writeOptions
  if (typeof opts_ === 'object') {
    if (opts_.makeDirectories) {
      makeDirectoriesSync(outPath)
    }
    delete opts_.makeDirectories
    writeOptions = opts_
  }
  var fileFormatter = discernFileFormatter(outPath)
  var formattedData = fileFormatter(data, writeOptions)
  fs.writeFileSync(outPath, formattedData)
  return formattedData
}
