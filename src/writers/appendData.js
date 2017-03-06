import fs from 'fs'
import isEmpty from 'lodash/isEmpty'
import makeDirectories from '../helpers/makeDirectories'
import readData from '../readers/readData'
import writeData from './writeData'
import extend from '../helpers/extend'

/**
 * Append to an existing data object, creating a new file if one does not exist. If appending to an object, data is extended with `_.extend`. For tabular formats (csv, tsv, etc), existing data and new data must be an array of flat objects (cannot contain nested objects or arrays).
 *
 * Supported formats:
 *
 * * `.json` Array of objects
 * * `.csv` Comma-separated
 * * `.tsv` Tab-separated
 * * `.psv` Pipe-separated
 * * `.yaml` or `.yml` Yaml
 *
 * *Note: Does not currently support .dbf files.*
 *
 * @param {String} fileName the name of the file
 * @param {Object} data the data to write
 * @param {Object} [options] Optional config object, see below
 * @param {Boolean} [options.makeDirectories=false] If true, create intermediate directories to your data file.
 * @param {Function} callback callback of `(err, data)` where `err` is any error and `data` is the data that was written out
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
  if (typeof opts_ === 'object' && opts_.makeDirectories) {
    makeDirectories(outPath, proceed)
  } else {
    proceed()
  }
  function proceed (err) {
    if (err) {
      throw err
    }
    // Run append file to delegate creating a new file if none exists
    fs.appendFile(outPath, '', function (err) {
      if (!err) {
        readData(outPath, function (err, existingData) {
          if (!err) {
            if (!isEmpty(existingData)) {
              if (Array.isArray(existingData)) {
                data = existingData.concat(data)
              } else if (typeof existingData === 'object') {
                data = extend({}, existingData, data)
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
