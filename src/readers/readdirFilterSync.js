import readdir from './readdir'

/**
 * Syncronous version of {@link readdirFilter}. Get a list of a directory's files and folders if certain critera are met.
 *
 * @function readdirFilterSync
 * @param {String} dirPath The directory to read from
 * @param {Object} options Filter options, see below
 * @param {Boolean} [options.fullPath=false] If `true`, return the full path of the file, otherwise just return the file name.
 * @param {Boolean} [options.skipFiles=false] If `true`, omit files from results.
 * @param {Boolean} [options.skipDirs=false] If `true`, omit directories from results.
 * @param {Boolean} [options.skipHidden=false] If `true`, omit files that start with a dot from results. Shorthand for `{exclude: /^\./}`.
 * @param {String|RegExp|Array<String|RegExp>} options.include If given a string, return files that have that string as their extension. If given a Regular Expression, return the files whose name matches the pattern. Can also take a list of either type. List matching behavior is described in `includeMatchAll`.
 * @param {String|RegExp|Array<String|RegExp>} options.exclude If given a string, return files that do not have that string as their extension. If given a Regular Expression, omit files whose name matches the pattern. Can also take a list of either type. List matching behavior is described in `excludeMatchAll`.
 * @param {Boolean} [options.includeMatchAll=false] If true, require all include conditions to be met for a file to be included.
 * @param {Boolean} [options.excludeMatchAll=false] If true, require all exclude conditions to be met for a file to be excluded.
 * @returns {Array<String>} List of matching file names
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
