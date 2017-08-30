import mkdirp from 'mkdirp'
import {dirname} from '../utils/path'
import discernPath from './discernPath'

/**
 * Synchronous version of {link #makeDirectories}. Delegates to [mkdirp](http://npmjs.org/package/mkdirp) module
 *
 * @function makeDirectoriesSync
 * @param {String} outPath The path to a file
 *
 * @example
 * io.makeDirectories('path/to/create/to/data.tsv')
 *
 */
export default function makeDirectoriesSync (outPath) {
  mkdirp.sync(dirname(discernPath(outPath)))
}
