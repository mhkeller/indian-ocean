/* global describe, it */
const chai = require('chai');
const dsv = require('d3-dsv');

const io = require('../dist/indian-ocean.cjs.js');
const testDataPath = require('./utils/testDataPath');

const assert = chai.assert;

describe('discernParser()', () => {
	describe('no extension', () => {
		it('should be text parser', () => {
			assert.equal(io.discernParser('/fake/path/what_is_this_file').toString(), io.parsers.txt.toString());
		});

		it('should be text parser as method', () => {
			assert.equal(io.discernParser('/fake/path/what_is_this_file').toString(), io.parseTxt.toString());
		});
	});

	describe('csv', () => {
		it('should be csv parser', () => {
			assert.equal(io.discernParser(testDataPath('csv/empty.csv')).toString(), io.parsers.csv.toString());
		});

		it('should be csv parser as method', () => {
			assert.equal(io.discernParser(testDataPath('csv/empty.csv')).toString(), io.parseCsv.toString());
		});
	});

	describe('tsv', () => {
		it('should be tsv parser', () => {
			assert.equal(io.discernParser(testDataPath('tsv/empty.tsv')).toString(), io.parsers.tsv.toString());
		});

		it('should be tsv parser as method', () => {
			assert.equal(io.discernParser(testDataPath('tsv/empty.tsv')).toString(), io.parseTsv.toString());
		});
	});

	describe('psv', () => {
		it('should be psv parser', () => {
			assert.equal(io.discernParser(testDataPath('psv/empty.psv')).toString(), io.parsers.psv.toString());
		});

		it('should be psv parser as method', () => {
			assert.equal(io.discernParser(testDataPath('psv/empty.psv')).toString(), io.parsePsv.toString());
		});
	});

	describe('txt', () => {
		it('should be txt parser', () => {
			assert.equal(io.discernParser(testDataPath('txt/empty.txt')).toString(), io.parsers.txt.toString());
		});

		it('should be txt parser as method', () => {
			assert.equal(io.discernParser(testDataPath('txt/empty.txt')).toString(), io.parseTxt.toString());
		});
	});

	describe('aml', () => {
		it('should be aml parser', () => {
			assert.equal(io.discernParser(testDataPath('aml/empty.aml')).toString(), io.parsers.aml.toString());
		});

		it('should be aml parser as method', () => {
			assert.equal(io.discernParser(testDataPath('aml/empty.aml')).toString(), io.parseAml.toString());
		});
	});

	describe('json', () => {
		it('should be json parser', () => {
			assert.equal(io.discernParser(testDataPath('json/empty.json')).toString(), io.parsers.json.toString());
		});

		it('should be json parser as method', () => {
			assert.equal(io.discernParser(testDataPath('json/empty.json')).toString(), io.parseJson.toString());
		});
	});

	describe('geojson', () => {
		it('should be geojson parser', () => {
			assert.equal(io.discernParser(testDataPath('geojson/empty.geojson')).toString(), io.parsers.geojson.toString());
		});

		it('should be geojson parser as method', () => {
			assert.equal(io.discernParser(testDataPath('geojson/empty.geojson')).toString(), io.parseJson.toString());
		});
	});

	describe('topojson', () => {
		it('should be topojson parser', () => {
			assert.equal(io.discernParser(testDataPath('topojson/empty.topojson')).toString(), io.parsers.topojson.toString());
		});

		it('should be topojson parser as method', () => {
			assert.equal(io.discernParser(testDataPath('topojson/empty.topojson')).toString(), io.parseJson.toString());
		});
	});

	describe('custom delimiter: `_`', () => {
		it('should be custom parser', () => {
			const testStr = 'name_city\nAlice_New York\nBob_Philadelphia';
			assert.equal(JSON.stringify(io.discernParser('_', { delimiter: true })(testStr)), JSON.stringify(dsv.dsvFormat('_').parse(testStr)));
		});
	});
});
