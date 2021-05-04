/* global describe, it */
const chai = require('chai');

const io = require('../dist/indian-ocean.cjs.js');
const testDataPath = require('./utils/testDataPath');

const assert = chai.assert;

describe('discernFormat()', () => {
	describe('no extension', () => {
		it('should be false', () => {
			assert.equal(io.discernFormat('/fake/path/what_is_this_file'), false);
		});
		it('should be false for dotfiles', () => {
			assert.equal(io.discernFormat('/fake/path/.gitignore'), false);
		});
	});

	describe('csv', () => {
		it('should properly discern csv format', () => {
			assert.equal(io.discernFormat(testDataPath('csv/empty.csv')), 'csv');
		});
	});

	describe('tsv', () => {
		it('should properly discern tsv format', () => {
			assert.equal(io.discernFormat(testDataPath('tsv/empty.tsv')), 'tsv');
		});
	});

	describe('psv', () => {
		it('should properly discern psv format', () => {
			assert.equal(io.discernFormat(testDataPath('psv/empty.psv')), 'psv');
		});
	});

	describe('txt', () => {
		it('should properly discern txt format', () => {
			assert.equal(io.discernFormat(testDataPath('txt/empty.txt')), 'txt');
		});
	});

	describe('dbf', () => {
		it('should properly discern dbf format', () => {
			assert.equal(io.discernFormat(testDataPath('dbf/empty.dbf')), 'dbf');
		});
	});

	describe('aml', () => {
		it('should properly discern aml format', () => {
			assert.equal(io.discernFormat(testDataPath('aml/empty.aml')), 'aml');
		});
	});

	describe('json', () => {
		it('should properly discern json format', () => {
			assert.equal(io.discernFormat(testDataPath('json/empty.json')), 'json');
		});
	});

	describe('geojson', () => {
		it('should properly discern geojson format', () => {
			assert.equal(io.discernFormat(testDataPath('geojson/empty.geojson')), 'geojson');
		});
	});

	describe('topojson', () => {
		it('should properly discern topojson format', () => {
			assert.equal(io.discernFormat(testDataPath('topojson/empty.topojson')), 'topojson');
		});
	});
});
