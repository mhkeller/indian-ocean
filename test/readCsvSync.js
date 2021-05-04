/* global describe, it */
const chai = require('chai');

const io = require('../dist/indian-ocean.cjs.js');
const testDataPath = require('./utils/testDataPath');

const { assertBasicValid } = require('./assertions');

const assert = chai.assert;

describe('readCsvSync()', () => {
	describe('empty', () => {
		it('should be empty', () => {
			assert.lengthOf(io.readCsvSync(testDataPath('csv/empty.csv')), 0);
		});
	});

	describe('basic', () => {
		it('should match expected json', () => {
			const json = io.readCsvSync(testDataPath('csv/basic.csv'));
			assertBasicValid(json, true);
		});
	});

	describe('basic map', () => {
		it('should match expected json', () => {
			const json = io.readCsvSync(testDataPath('csv/basic.csv'), {
				map(row) {
					row.height = +row.height;
					return row;
				}
			});
			assertBasicValid(json);
		});
	});

	describe('basic map shorthand', () => {
		it('should match expected json', () => {
			const json = io.readCsvSync(testDataPath('csv/basic.csv'), row => {
				row.height = +row.height;
				return row;
			});
			assertBasicValid(json);
		});
	});
});
