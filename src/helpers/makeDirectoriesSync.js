/* istanbul ignore next */
import mkdirp from 'mkdirp'
import {dirname} from '../utils/path'

/**
 * Synchronous version of {@link makeDirectories}. Delegates to [mkdirp](http://npmjs.org/package/mkdirp) module.
 *
 * @function makeDirectoriesSync
 * @param {String} outPath The path to a file
 *
 * @example
 * io.makeDirectoriesSync('path/to/create/to/data.tsv')
 *
 * @example
 * // Must end in `/` for the last item to be interpreted as a folder as well.
 * io.makeDirectoriesSync('path/to/create/to/another-folder/')
 *
 */
export default function makeDirectoriesSync (outPath) {
  mkdirp.sync(dirname(outPath))
}
