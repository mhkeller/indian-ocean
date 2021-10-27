/**
 * Synchronous version of {@link writers#appendData}. See that function for supported formats
 *
 * @function appendDataSync
 * @param {String} filePath File to append to
 * @param {Array|Object} data The new data to append
 * @param {Object} [options] Optional options object passed to {@link writeData}. See that function for format-specific options.
 * @returns {Object} The combined data that was written
 *
 * @example
 * io.appendDataSync('path/to/data.json', jsonData)
 *
 * io.appendDataSync('path/to/create/to/data.csv', flatJsonData, {makeDirectories: true})
 */
export default function appendDataSync(outPath: any, data: any[] | any, opts_: any): any;
