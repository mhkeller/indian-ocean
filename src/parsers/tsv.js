/* istanbul ignore next */
import { tsvParse } from 'd3-dsv/src/tsv';

export default function parseTsv(str, parserOptions) {
	parserOptions = parserOptions || {};
	return tsvParse(str, parserOptions.map);
}
