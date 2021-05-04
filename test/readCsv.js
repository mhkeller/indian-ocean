/* global describe, it */
const chai = require('chai');

const io = require('../dist/indian-ocean.cjs.js');
const testDataPath = require('./utils/testDataPath');

const { assertBasicValid } = require('./assertions/index.js');

const assert = chai.assert;

describe('readCsv()', () => {
	describe('empty', () => {
		it('should be empty', done => {
			io.readCsv(testDataPath('csv/empty.csv'), (err, json) => {
				assert.equal(err, null);
				assert.lengthOf(json, 0);
				done();
			});
		});
	});

	describe('basic', () => {
		it('should match expected json', done => {
			io.readCsv(testDataPath('csv/basic.csv'), (err, json) => {
				assert.equal(err, null);
				assertBasicValid(json, true);
				done();
			});
		});
	});

	describe('basic map', () => {
		it('should match expected json', done => {
			io.readCsv(testDataPath('csv/basic.csv'), {
				map(row, i, columns) {
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
			io.readCsv(testDataPath('csv/basic.csv'), (row, i, columns) => {
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
