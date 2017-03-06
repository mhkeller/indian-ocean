import readDbf from '../readers/readDbf'
import writeData from '../writers/writeData'

/**
 * Reads in a dbf file with `.readDbf` and write to file using `.writeData`. A convenience function for converting DBFs to more useable formats. Formerly known as `writeDbfToData` and is aliased for legacy support.
 *
 * @param {String} inFileName the input file name
 * @param {String} outFileName the output file name
 * @param {Object} [options] Optional config object, see below
 * @param {Boolean} [options.makeDirectories=false] If true, create intermediate directories to your data file.
 * @param {Function} callback callback that takes error (if any)
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
export default function dbfToData (inPath, outPath, opts_, cb) {
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
