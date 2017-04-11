import fs from 'fs'
import _ from 'underscore'
import makeDirectoriesSync from '../helpers/makeDirectoriesSync'
import readDataSync from '../readers/readDataSync'
import writeDataSync from './writeDataSync'
import extend from '../helpers/extend'

/**
 * Synchronous version of {@link writers#appendData}. See that function for supported formats
 *
 * @param {String} fileName the name of the file
 * @param {Object} [options] Optional config object, see below
 * @param {Boolean} [options.makeDirectories=false] If true, create intermediate directories to your data file.
 * @param {Object} data the data to write
 * @returns {Object} the data that was written
 *
 * @example
 * io.appendDataSync('path/to/data.json', jsonData)
 *
 * io.appendDataSync('path/to/create/to/data.csv', flatJsonData, {makeDirectories: true})
 */
export default function appendDataSync (outPath, data, opts_) {
  // Run append file to delegate creating a new file if none exists
  if (opts_ && opts_.makeDirectories) {
    makeDirectoriesSync(outPath)
  }
  fs.appendFileSync(outPath, '')
  var existingData = readDataSync(outPath)
  if (!_.isEmpty(existingData)) {
    if (Array.isArray(existingData)) {
      data = existingData.concat(data)
    } else if (typeof existingData === 'object') {
      data = extend({}, existingData, data)
    }
  }
  writeDataSync(outPath, data, opts_)
  return data
}
