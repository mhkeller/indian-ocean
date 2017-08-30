import {joinPath} from '../utils/path'

/**
 * If `filePath` is an Array it applies `path.join`. If it's is a function it calls it. Otherwise it returns `filePath`.
 * @param {(string|string[]|Function)} filePath the name of the file
 * @returns {string} a file path
 *
 * @example
 * io.discernPath('path/to/data.tsv')
 * io.discernPath([__dirname, 'path', 'to', 'data.tsv')
 * io.discernPath(function() { return 'path/to/data-' + now.getYear() + '.tsv' })
 */
export default function discernPath (filePath) {
  if (Array.isArray(filePath)) {
    return joinPath.apply(null, filePath)
  }

  if (typeof filePath === 'function') {
    return filePath()
  }

  return filePath
}
