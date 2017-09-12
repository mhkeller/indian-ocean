import fs from 'fs'

/**
 * Syncronous version of {@link helpers#exists}. Falls back to `fs.existsSync` if that function exists
 *
 * @function existsSync
 * @param {String} fileName the name of the file
 * @returns {Boolean} whether the file exists or not
 *
 * @example
 * var exists = io.existsSync('path/to/data.tsv')
 * console.log(exists) // `true` if file exists, `false` if not.
 */
export default function existsSync (filename) {
  if (fs.existsSync) {
    return fs.existsSync(filename)
  } else {
    try {
      fs.accessSync(filename)
      return true
    } catch (ex) {
      return false
    }
  }
}
