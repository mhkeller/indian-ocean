import fs from 'fs'

/**
 * Syncronous version of {@link exists}. Delegates to `fs.existsSync` if that function is available.
 *
 * @function existsSync
 * @param {String} filePath Input file path
 * @returns {Boolean} Whether the file exists or not
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
