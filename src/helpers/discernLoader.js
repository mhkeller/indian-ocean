import discernFormat from './discernFormat';
import loaders from '../loaders/index';

export default function discernLoader(filePath, opts_ = {}) {
	const which = opts_.sync === true ? 'sync' : 'async';
	const format = discernFormat(filePath);
	let loader = loaders[which][format];
	// If we don't have a loader for this format, read in as a normal file
	if (typeof loader === 'undefined') {
		loader = loaders[which].txt;
	}
	return loader;
}
