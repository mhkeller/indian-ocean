const io = require('../../dist/indian-ocean.cjs.js');
const assertBasicValid = require('./assertBasicValid.js');

module.exports = function readAssertBasicValid(path, columns) {
	const strFormats = ['json', 'geojson', 'topojson'];
	const strings = strFormats.indexOf(io.discernFormat(path)) === -1;
	const json = io.readDataSync(path);
	assertBasicValid(json, strings, columns);
};
