/* istanbul ignore next */
import archieml from 'archieml';
import identity from '../utils/identity';
import omit from '../utils/omit';

export default function parseAml(str, parserOptions) {
	parserOptions = parserOptions || {};
	const map = parserOptions.map || identity;
	const data = archieml.load(str, omit(parserOptions, ['map']));
	return map(data);
}
