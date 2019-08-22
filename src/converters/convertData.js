import readData from '../readers/readData'
import writeData from '../writers/writeData'

/**
 * Reads in data given a path ending in the file format with {@link readData} and writes to file using {@link writeData}. A convenience function for converting files to more other formats. All formats can convert to all others except as long as they are lists. For example, you can't convert an object-based aml file to a list format.
 *
 * @function convertData
 * @param {String} inFilePath Input file path
 * @param {String} outFilePath Output file path
 * @param {Object} [options] Optional config object that's passed to {@link writeData}. See that documentation for full options, which vary depending on the output format you choose.
 * @param {Function} callback Has signature `(err, dataStr)`. `dataStr` is the data that was written out as a string
 *
 * @example
 * io.convertData('path/to/data.dbf', 'path/to/data.csv', function (err, dataStr) {
 *   console.log(err)
 * })
 *
 * io.convertData('path/to/data.tsv', 'path/to/create/to/data.dbf', {makeDirectories: true}, function (err, dataStr) {
 *   console.log(err)
 * })
 */
export default function convertData (inPath, outPath, opts_, cb) {
  if (typeof cb === 'undefined') {
    cb = opts_
  }
  readData(inPath, function (error, jsonData) {
    if (error) {
      cb(error)
    } else {
      writeData(outPath, jsonData, opts_, cb)
    }
  })
}
