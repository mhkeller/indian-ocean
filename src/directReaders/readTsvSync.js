import readDataSync from '../readers/readDataSync';
import parserTsv from '../parsers/tsv';

/**
 * Synchronously read a tab-separated value file. Returns an empty array if file is empty.
 *
 * @function readTsvSync
 * @param {String} filePath Input file path
 * @param {Function|Object} [parserOptions] Optional map function or an object specifying the optional options below.
 * @param {Function} [parserOptions.map] Map function. Called once for each row if your file is an array (it tests if the first non-whitespace character is a `[`) with a callback signature `(row, i)` and delegates to `_.map`. Otherwise it's considered an object and the callback the signature is `(value, key)` and delegates to `_.mapObject`. See example below.
 * @param {Boolean} [parserOptions.trim=true] Trim any whitespace from the file before parsing. Default is true.
 * @returns {Array} the contents of the file as JSON
 *
 * @example
 * var data = io.readTsvSync('path/to/data.tsv')
 * console.log(data) // Json data
 *
 * // Transform values on load
 * var data = io.readTsvSync('path/to/data.tsv', function (row, i, columns) {
 *   console.log(columns) // [ 'name', 'occupation', 'height' ]
 *   row.height = +row.height // Convert this value to a number
 *   return row
 * })
 * console.log(data) // Json data with casted values
 */
export default function readTsvSync(filePath, opts_) {
	let parserOptions;
	if (typeof opts_ !== 'undefined') {
		parserOptions = typeof opts_ === 'function' ? { map: opts_ } : opts_;
	}
	return readDataSync(filePath, { parser: parserTsv, parserOptions });
}
