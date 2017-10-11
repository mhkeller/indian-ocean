import readDbf from '../directReaders/readDbf'
import writeData from '../writers/writeData'

/**
 * Reads in a dbf file with {@link readData} and write to file using {@link writeData}. A convenience function for converting DBFs to more useable formats. Formerly known as `writeDbfToData` and is aliased for legacy support.
 *
 * @function convertDbfToData
 * @param {String} inFilePath Input file path
 * @param {String} outFilePath Output file path
 * @param {Object} [options] Optional config object that's passed to {@link writeData}. See that documentation for full options, which vary depending on the output format you choose.
 * @param {Function} callback Has signature `(err, dataStr)`. `dataStr` is the data that was written out as a string
 *
 * @example
 * io.convertDbfToData('path/to/data.dbf', 'path/to/data.csv', function (err, dataStr) {
 *   console.log(err)
 * })
 *
 * io.convertDbfToData('path/to/data.dbf', 'path/to/create/to/data.csv', {makeDirectories: true}, function (err, dataStr) {
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
