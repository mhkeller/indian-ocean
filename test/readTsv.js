/* global describe, it */
const chai = require('chai');

const io = require('../dist/indian-ocean.cjs.js');
const testDataPath = require('./utils/testDataPath');

const { assertBasicValid } = require('./assertions');

const assert = chai.assert;

describe('readTsv()', () => {
	describe('empty', () => {
		it('should be empty', done => {
			io.readTsv(testDataPath('tsv/empty.tsv'), (err, json) => {
				assert.equal(err, null);
				assert.lengthOf(json, 0);
				done();
			});
		});
	});

	describe('basic', () => {
		it('should match expected json', done => {
			io.readTsv(testDataPath('tsv/basic.tsv'), (err, json) => {
				assert.equal(err, null);
				assertBasicValid(json, true);
				done();
			});
		});
	});

	describe('basic map', () => {
		it('should match expected json', done => {
			io.readTsv(testDataPath('tsv/basic.tsv'), {
				map(row) {
					row.height = +row.height;
					return row;
				}
			}, (err, json) => {
				assert.equal(err, null);
				assertBasicValid(json);
				done();
			});
		});
	});

	describe('basic map shorthand', () => {
		it('should match expected json', done => {
			io.readTsv(testDataPath('tsv/basic.tsv'), row => {
				row.height = +row.height;
				return row;
			}, (err, json) => {
				assert.equal(err, null);
				assertBasicValid(json);
				done();
			});
		});
	});
});
