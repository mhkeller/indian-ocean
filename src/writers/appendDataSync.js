/* istanbul ignore next */
import fs from 'fs'
/* istanbul ignore next */
import _ from 'underscore'
import makeDirectoriesSync from '../helpers/makeDirectoriesSync'
import readDataSync from '../readers/readDataSync'
import writeDataSync from './writeDataSync'
import omit from '../utils/omit'

/**
 * Synchronous version of {@link writers#appendData}. See that function for supported formats
 *
 * @function appendDataSync
 * @param {String} filePath File to append to
 * @param {Array|Object} data The new data to append
 * @param {Object} [options] Optional options object passed to {@link writeData}. See that function for format-specific options.
 * @returns {Object} The combined data that was written
 *
 * @example
 * io.appendDataSync('path/to/data.json', jsonData)
 *
 * io.appendDataSync('path/to/create/to/data.csv', flatJsonData, {makeDirectories: true})
 */
export default function appendDataSync (outPath, data, opts_) {
  // Run append file to delegate creating a new file if none exists
  if (opts_ && (opts_.makeDirectories === true || opts_.makeDirs === true)) {
    makeDirectoriesSync(outPath)
  }
  opts_ = omit(opts_, ['makeDirectories', 'makeDirs'])
  fs.appendFileSync(outPath, '')
  var existingData = readDataSync(outPath)
  if (!_.isEmpty(existingData)) {
    if (Array.isArray(existingData)) {
      data = existingData.concat(data)
    } else if (typeof existingData === 'object') {
      data = Object.assign({}, existingData, data)
    }
  }
  writeDataSync(outPath, data, opts_)
  return data
}
