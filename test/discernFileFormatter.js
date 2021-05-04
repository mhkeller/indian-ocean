/* global describe, it */
const chai = require('chai');
const io = require('../dist/indian-ocean.cjs.js');

const testDataPath = require('./utils/testDataPath');

const assert = chai.assert;

describe('discernFileFormatter()', () => {
	describe('no extension', () => {
		it('should be text formatter', () => {
			assert.equal(io.discernFileFormatter('/fake/path/what_is_this_file').toString(), io.formatters.txt.toString());
		});

		it('should be text formatter as method', () => {
			assert.equal(io.discernFileFormatter('/fake/path/what_is_this_file').toString(), io.formatTxt.toString());
		});
	});

	describe('csv', () => {
		it('should be csv formatter', () => {
			assert.equal(io.discernFileFormatter(testDataPath('csv/empty.csv')).toString(), io.formatters.csv.toString());
		});

		it('should be csv formatter as method', () => {
			assert.equal(io.discernFileFormatter(testDataPath('csv/empty.csv')).toString(), io.formatCsv.toString());
		});
	});

	describe('tsv', () => {
		it('should be tsv formatter', () => {
			assert.equal(io.discernFileFormatter(testDataPath('tsv/empty.tsv')).toString(), io.formatters.tsv.toString());
		});

		it('should be tsv formatter as method', () => {
			assert.equal(io.discernFileFormatter(testDataPath('tsv/empty.tsv')).toString(), io.formatTsv.toString());
		});
	});

	describe('psv', () => {
		it('should be psv formatter', () => {
			assert.equal(io.discernFileFormatter(testDataPath('psv/empty.psv')).toString(), io.formatters.psv.toString());
		});

		it('should be psv formatter as method', () => {
			assert.equal(io.discernFileFormatter(testDataPath('psv/empty.psv')).toString(), io.formatPsv.toString());
		});
	});

	describe('txt', () => {
		it('should be txt formatter', () => {
			assert.equal(io.discernFileFormatter(testDataPath('txt/empty.txt')).toString(), io.formatters.txt.toString());
		});

		it('should be txt formatter as method', () => {
			assert.equal(io.discernFileFormatter(testDataPath('txt/empty.txt')).toString(), io.formatTxt.toString());
		});
	});

	describe('json', () => {
		it('should be json formatter', () => {
			assert.equal(io.discernFileFormatter(testDataPath('json/empty.json')).toString(), io.formatters.json.toString());
		});

		it('should be json formatter as method', () => {
			assert.equal(io.discernFileFormatter(testDataPath('json/empty.json')).toString(), io.formatJson.toString());
		});
	});

	describe('geojson', () => {
		it('should be geojson formatter', () => {
			assert.equal(io.discernFileFormatter(testDataPath('geojson/empty.geojson')).toString(), io.formatters.geojson.toString());
		});

		it('should be geojson formatter as method', () => {
			assert.equal(io.discernFileFormatter(testDataPath('geojson/empty.geojson')).toString(), io.formatJson.toString());
		});
	});

	describe('topojson', () => {
		it('should be topojson formatter', () => {
			assert.equal(io.discernFileFormatter(testDataPath('topojson/empty.topojson')).toString(), io.formatters.topojson.toString());
		});

		it('should be topojson formatter as method', () => {
			assert.equal(io.discernFileFormatter(testDataPath('topojson/empty.topojson')).toString(), io.formatJson.toString());
		});
	});
});
