import fs from 'fs'

/**
 * Asynchronously test whether a file exists or not by using `fs.access` modified from https://github.com/nodejs/io.js/issues/1592#issuecomment-98392899.
 * @param {String} fileName the name of the file
 * @param {Function} callback has the signature `(err, exists)`
 *
 * @example
 * var exists = io.exists('path/to/data.tsv', function (err, exists) {
 *   console.log(exists) // `true` if the file exists, `false` if not.
 * })
 *
 */
export default function exists (filename, cb) {
  fs.access(filename, function (err) {
    var exists
    if (err && err.code === 'ENOENT') {
      exists = false
      err = null
    } else if (!err) {
      exists = true
    }
    cb(err, exists)
  })
}