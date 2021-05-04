/* istanbul ignore next */
import identity from '../utils/identity';

const shapefile = require('shapefile');

export default function dbf(filePath, parser, parserOptions, cb) {
	const values = [];
	parserOptions = parserOptions || {};
	const map = parserOptions.map || identity;
	let i = 0;
	shapefile.openDbf(filePath)
		.then(source => source.read()
			.then(function log(result) {
				i += 1;
				if (result.done) return cb(null, values);
				values.push(map(result.value, i));
				return source.read().then(log);
			}))
		.catch(error => cb(error.stack));
}
