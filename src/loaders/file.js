/* istanbul ignore next */
import fs from 'fs';
import discernFormat from '../helpers/discernFormat';
import { formatsIndex } from '../config/equivalentFormats';
import stripBom from '../utils/stripBom';

export default function file(filePath, parser, parserOptions, cb) {
	// eslint-disable-next-line consistent-return
	fs.readFile(filePath, 'utf8', (err, data) => {
		const fileFormat = discernFormat(filePath);
		if ((fileFormat === 'json' || formatsIndex.json.indexOf(fileFormat) > -1) && data === '') {
			data = '[]';
		}
		if (err) {
			cb(err);
			return false;
		}
		let parsed;
		try {
			data = stripBom(data);
			if (!parserOptions || parserOptions.trim !== false) {
				data = data.trim();
			}
			if (typeof parser === 'function') {
				parsed = parser(data, parserOptions);
			} else if (typeof parser === 'object' && typeof parser.parse === 'function') {
				parsed = parser.parse(data, parserOptions);
			} else {
				parsed = 'Your specified parser is not properly formatted. It must either be a function or have a `parse` method.';
			}
		} catch (err2) {
			cb(err2);
			return null;
		}
		cb(null, parsed);
	});
}
