import readdir from './readdir'

/**
 * Synchronously get a list of a directory's files and folders if certain critera are met.
 *
 * @param {String} dirPath The directory to read from
 * @param {Object} [options] Optional, filter options, see below
 * @param {String|RegExp|Array<String>|Array<RegExp>} [options.include] Optional, if given a string, return files that have that string as their extension. If given a Regular Expression, return the file that matches the pattern. Can also take a list of both. List matching behavior is described in `includeAll`.
 * @param {String|RegExp|Array<String>|Array<RegExp>} [options.exclude] Optional, if given a string, return files that do not have that string as their extension. If given a Regular Expression, return the file that matches the pattern. Can also take a list of both. List matching behavior is described in `excludeAll`.
 * @param {Boolean} [options.includeMatchAll=false] Optional, if true, require all include conditions to be met for a file to be included.
 * @param {Boolean} [options.excludeMatchAll=false] Optional, if true, require all exclude conditions to be met for a file to be excluded.
 * @param {Boolean} [options.fullPath=false] Optional, if `true` the full path of the file, otherwise return just the file name.
 * @param {Boolean} [options.skipFiles=false] Optional, if `true`, only include directories.
 * @param {Boolean} [options.skipDirectories=false] Optional, if `true`, only include files.
 * @returns {Array<String>} The matching file names
 *
 * @example
 * // dir contains `data-0.tsv`, `data-0.json`, `data-0.csv`, `data-1.csv`, `.hidden-file`
 * var files = io.readdirFilterSync('path/to/files', {include: 'csv'})
 * console.log(files) // ['data-0.csv', 'data-1.csv']
 *
 * var files = io.readdirFilterSync('path/to/files', {include: [/^data/], exclude: 'json', fullPath: true})
 * console.log(files) // ['path/to/files/data-0.csv', 'path/to/files/data-1.csv', 'path/to/files/data-0.tsv']
 *
 * var files = io.readdirFilterSync('path/to/files', {include: [/^data/, 'json'], fullPath: true, includeMatchAll: true})
 * console.log(files) // ['path/to/files/data-0.json', 'path/to/files/data-1.json']
 *
 */
export default function readdirFilterSync (dirPath, opts_) {
  return readdir({async: false}, dirPath, opts_)
}
