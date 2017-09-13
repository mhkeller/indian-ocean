import readDbf from '../readers/readDbf'
import writeData from '../writers/writeData'

/**
 * Reads in a dbf fil e with `.readDbf` and write to file using `.writeData`. A convenience function for converting DBFs to more useable formats. Formerly known as `writeDbfToData` and is aliased for legacy support.
 *
 * @function convertDbfToData
 * @param {String} inFilePath Input file path
 * @param {String} outFileName Output file path
 * @param {Object} [options] Optional config object that's passed to {@link writeData}. See its documentation for full options.
 * @param {Function} callback Has signature `(err)`
 *
 * @example
 * io.convertDbfToData('path/to/data.dbf', 'path/to/data.csv', function (err) {
 *   console.log(err)
 * })
 *
 * io.convertDbfToData('path/to/data.dbf', 'path/to/create/to/data.csv', {makeDirectories: true}, function (err) {
 *   console.log(err)
 * })
 */
export default function convertDbfToData (inPath, outPath, opts_, cb) {
  if (typeof cb === 'undefined') {
    cb = opts_
  }
  readDbf(inPath, function (error, jsonData) {
    if (error) {
      cb(error)
    } else {
      writeData(outPath, jsonData, opts_, cb)
    }
  })
}
