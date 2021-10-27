/**
 * Append to an existing data object, creating a new file if one does not exist. If appending to an object, data is extended with `Object.assign`. For tabular formats (csv, tsv, etc), existing data and new data must be an array of flat objects (cannot contain nested objects or arrays).
 *
 * Supported formats:
 *
 * * `.json` Array of objects
 * * `.csv` Comma-separated
 * * `.tsv` Tab-separated
 * * `.psv` Pipe-separated
 *
 * *Note: Does not currently support .dbf files.*
 *
 * @function appendData
 * @param {String} filePath File to append to
 * @param {Array|Object} data The new data to append
 * @param {Object} [options] Optional options object passed to {@link writeData}. See that function for format-specific options.
 * @param {Function} callback Has signature `(err, data)`. Data is the combined data that was written out
 *
 * @example
 * io.appendData('path/to/data.json', jsonData, function (err) {
 *   console.log(err)
 * })
 *
 * io.appendData('path/to/create/to/data.csv', flatJsonData, {makeDirectories: true}, function (err){
 *   console.log(err)
 * })
 */
export default function appendData(outPath: any, data: any[] | any, opts_: any, cb: any): void;
