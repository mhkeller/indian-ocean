const io = require('../../dist/indian-ocean.cjs.js');
const assertBasicValidObject = require('./assertBasicValidObject.js');

module.exports = function readAssertBasicValidObject(path, row) {
	const strFormats = ['json', 'geojson', 'topojson'];
	const strings = strFormats.indexOf(io.discernFormat(path)) === -1;
	const json = io.readDataSync(path);
	assertBasicValidObject(json, strings, row);
};
