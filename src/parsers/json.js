/* istanbul ignore next */
import _ from 'underscore';
import identity from '../utils/identity';

export default function parseJson(str, parserOptions) {
	parserOptions = parserOptions || {};
	// Do a naive test whether this is a string or an object
	let mapFn;
	if (parserOptions.map) {
		if (str.trim().charAt(0) === '[') {
			mapFn = _.map;
		} else {
			mapFn = _.mapObject;
		}
	} else {
		mapFn = identity;
	}
	const jsonParser = JSON.parse;
	return mapFn(jsonParser(str, parserOptions.reviver, parserOptions.filename), parserOptions.map);
}
