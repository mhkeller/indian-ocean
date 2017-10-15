/* istanbul ignore next */
import mkdirp from 'mkdirp'
import {dirname} from '../utils/path'

/**
 * Asynchronously create directories along a given file path. Delegates to [mkdirp](http://npmjs.org/package/mkdirp) module.
 *
 * @function makeDirectories
 * @param {String} outPath The path to a file
 * @param {Function} callback The function to do once this is done. Has signature of `(err)`
 *
 * @example
 * io.makeDirectories('path/to/create/to/data.tsv', function (err) {
 *   console.log(err) // null
 * })
 *
 */
export default function makeDirectories (outPath, cb) {
  mkdirp(dirname(outPath), function (err) {
    cb(err)
  })
}
