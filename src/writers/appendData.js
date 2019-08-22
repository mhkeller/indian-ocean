/* istanbul ignore next */
import fs from 'fs'
/* istanbul ignore next */
import _ from 'underscore'
import makeDirectories from '../helpers/makeDirectories'
import readData from '../readers/readData'
import writeData from './writeData'
import omit from '../utils/omit'

/**
 * Append to an existing data object, creating a new file if one does not exist. If appending to an object, data is extended with `Object.assign`. For tabular formats (csv, tsv, etc), existing data and new data must be an array of flat objects (cannot contain nested objects or arrays).
 *
 * Supported formats:
 *
 * * `.json` Array of objects
 * * `.csv` Comma-separated
 * * `.tsv` Tab-separated
 * * `.psv` Pipe-separated
 *
 * *Note: Does not currently support .dbf files.*
 *
 * @function appendData
 * @param {String} filePath File to append to
 * @param {Array|Object} data The new data to append
 * @param {Object} [options] Optional options object passed to {@link writeData}. See that function for format-specific options.
 * @param {Function} callback Has signature `(err, data)`. Data is the combined data that was written out
 *
 * @example
 * io.appendData('path/to/data.json', jsonData, function (err) {
 *   console.log(err)
 * })
 *
 * io.appendData('path/to/create/to/data.csv', flatJsonData, {makeDirectories: true}, function (err){
 *   console.log(err)
 * })
 */
export default function appendData (outPath, data, opts_, cb) {
  if (typeof cb === 'undefined') {
    cb = opts_
  }
  if (typeof opts_ === 'object' && (opts_.makeDirectories === true || opts_.makeDirs === true)) {
    makeDirectories(outPath, proceed)
  } else {
    proceed()
  }
  function proceed (err) {
    if (err) {
      throw err
    }
    opts_ = omit(opts_, ['makeDirectories', 'makeDirs'])
    // Run append file to delegate creating a new file if none exists
    fs.appendFile(outPath, '', function (err) {
      if (!err) {
        readData(outPath, function (err, existingData) {
          if (!err) {
            if (!_.isEmpty(existingData)) {
              if (Array.isArray(existingData)) {
                data = existingData.concat(data)
              } else if (typeof existingData === 'object') {
                data = Object.assign({}, existingData, data)
              }
            }
            writeData(outPath, data, opts_, cb)
          } else {
            cb(err)
          }
        })
      } else {
        cb(err)
      }
    })
  }
}
