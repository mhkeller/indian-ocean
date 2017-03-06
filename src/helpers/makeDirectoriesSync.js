import mkdirp from 'mkdirp'
import {dirname} from '../utils/path'

/**
 * Synchronous version of `makeDirectories`
 *
 * @param {String} outPath The path to a file
 *
 * @example
 * io.makeDirectories('path/to/create/to/data.tsv')
 *
 */
export default function makeDirectoriesSync (outPath) {
  mkdirp.sync(dirname(outPath))
}
