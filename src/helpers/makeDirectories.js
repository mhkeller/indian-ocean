/* istanbul ignore next */
import mkdirp from 'mkdirp'
import {dirname} from '../utils/path'

/**
 * Asynchronously create directories along a given file path. Delegates to [mkdirp](http://npmjs.org/package/mkdirp) module. If the last element in your file path is also a folder, it must end in `/` or else it will be interpreted as a file and not created.
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
 * // Must end in `/` for the last item to be interpreted as a folder as well.
 * io.makeDirectories('path/to/create/to/another-folder/', function (err) {
 *   console.log(err) // null
 * })
 *
 */
export default function makeDirectories (outPath, cb) {
  mkdirp(dirname(outPath), function (err) {
    cb(err)
  })
}
