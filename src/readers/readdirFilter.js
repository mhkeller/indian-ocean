import readdir from './readdir'

/**
 * Get a list of a directory's files and folders if certain critera are met.
 *
 * @param {String} dirPath The directory to read from
 * @param {Object} options Optional, filter options, see below
 * @param {String|RegExp|Array<String>|Array<RegExp>} options.include If given a string, return files that have that string as their extension. If given a Regular Expression, return the file that matches the pattern. Can also take a list of both. List matching behavior is described in `includeAll`.
 * @param {String|RegExp|Array<String>|Array<RegExp>} options.exclude If given a string, return files that do not have that string as their extension. If given a Regular Expression, return the file that matches the pattern. Can also take a list of both. List matching behavior is described in `excludeAll`.
 * @param {Boolean} [options.includeMatchAll=false] If true, require all include conditions to be met for a file to be included.
 * @param {Boolean} [options.excludeMatchAll=false] If true, require all exclude conditions to be met for a file to be excluded.
 * @param {Boolean} [options.fullPath=false] If `true` the full path of the file, otherwise return just the file name.
 * @param {Boolean} [options.skipFiles=false] If `true`, only include directories.
 * @param {Boolean} [options.skipDirectories=false] If `true`, only include files.
 * @param {Function} callback Callback fired with signature of `(err, files)` where `files` is a list of matching file names.
 *
 * @example
 * // dir contains `data-0.tsv`, `data-0.json`, `data-0.csv`, `data-1.csv`, `.hidden-file`
 * io.readdirFilter('path/to/files', {include: 'csv'}, function(err, files){
 *   console.log(files) // ['data-0.csv', 'data-1.csv']
 * })
 *
 * io.readdirFilter('path/to/files', {include: [/^data/], exclude: ['csv', 'json']}, , function(err, files){
 *   console.log(files) // ['path/to/files/data-0.csv', 'path/to/files/data-1.csv', 'path/to/files/data-0.tsv']
 * })
 *
 */
export default function readdirFilter (dirPath, opts_, cb) {
  if (typeof cb === 'undefined') {
    cb = opts_
    opts_ = undefined
  }

  readdir({async: true}, dirPath, opts_, cb)
}
