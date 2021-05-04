// Used internally by `readdir` functions to make more DRY
/* istanbul ignore next */
import fs from 'fs';
/* istanbul ignore next */
import queue from 'd3-queue/src/queue';
import matches from '../helpers/matches';
import identity from '../utils/identity';
import { joinPath } from '../utils/path';

export default function readdir(modeInfo, dirPath, opts_, cb) {
	opts_ = opts_ || {};
	const isAsync = modeInfo.async;

	// Convert to array if a string
	opts_.include = strToArray(opts_.include);
	opts_.exclude = strToArray(opts_.exclude);

	if (opts_.skipHidden === true) {
		const regex = /^\./;
		if (Array.isArray(opts_.exclude)) {
			opts_.exclude.push(regex);
		} else {
			opts_.exclude = [regex];
		}
	}

	// Set defaults if not provided
	opts_.includeMatchAll = (opts_.includeMatchAll) ? 'every' : 'some';
	opts_.excludeMatchAll = (opts_.excludeMatchAll) ? 'every' : 'some';

	if (isAsync === true) {
		fs.readdir(dirPath, (err, files) => {
			if (err) {
				throw err;
			}
			filter(files, cb);
		});
	} else {
		return filterSync(fs.readdirSync(dirPath));
	}

	function strToArray(val) {
		if (val && !Array.isArray(val)) {
			val = [val];
		}
		return val;
	}

	function filterByType(file, cb) {
		// We need the full path so convert it if it isn't already
		const filePath = (opts_.fullPath) ? file : joinPath(dirPath, file);

		if (isAsync === true) {
			fs.stat(filePath, (err, stats) => {
				const filtered = getFiltered(stats.isDirectory());
				cb(err, filtered);
			});
		} else {
			return getFiltered(fs.statSync(filePath).isDirectory());
		}

		function getFiltered(isDir) {
			// Keep the two names for legacy reasons
			if (opts_.skipDirectories === true || opts_.skipDirs === true) {
				if (isDir) {
					return false;
				}
			}
			if (opts_.skipFiles === true) {
				if (!isDir) {
					return false;
				}
			}
			return file;
		}
	}

	function filterByMatchers(files) {
		const filtered = files.filter(fileName => {
			let isExcluded;
			let isIncluded;

			// Don't include if matches exclusion matcher
			if (opts_.exclude) {
				isExcluded = opts_.exclude[opts_.excludeMatchAll](matcher => {
					return matches(fileName, matcher);
				});
				if (isExcluded === true) {
					return false;
				}
			}

			// Include if matches inclusion matcher, exclude if it doesn't
			if (opts_.include) {
				isIncluded = opts_.include[opts_.includeMatchAll](matcher => {
					return matches(fileName, matcher);
				});
				return isIncluded;
			}

			// Return true if it makes it to here
			return true;
		});

		// Prefix with the full path if that's what we asked for
		if (opts_.fullPath === true) {
			return filtered.map(fileName => {
				return joinPath(dirPath, fileName);
			});
		}

		return filtered;
	}

	function filterSync(files) {
		const filtered = filterByMatchers(files);

		return filtered.map(file => {
			return filterByType(file);
		}).filter(identity);
	}

	function filter(files, cb2) {
		const filterQ = queue();

		const filtered = filterByMatchers(files);

		filtered.forEach(fileName => {
			filterQ.defer(filterByType, fileName);
		});

		filterQ.awaitAll((err, namesOfType) => {
			cb2(err, namesOfType.filter(identity));
		});
	}
}
