import fs from 'fs'
import discernPath from './discernPath'

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
export default function existsSync (filePath) {
  if (fs.existsSync) {
    return fs.existsSync(discernPath(filePath))
  } else {
    try {
      fs.accessSync(discernPath(filePath))
      return true
    } catch (ex) {
      return false
    }
  }
}
