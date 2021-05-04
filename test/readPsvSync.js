/* global describe, it */
const chai = require('chai');

const io = require('../dist/indian-ocean.cjs.js');
const testDataPath = require('./utils/testDataPath');

const { assertBasicValid } = require('./assertions');

const assert = chai.assert;

describe('readPsvSync()', () => {
	describe('empty', () => {
		it('should be empty', () => {
			assert.lengthOf(io.readPsvSync(testDataPath('psv/empty.psv')), 0);
		});
	});

	describe('basic', () => {
		it('should match expected json', () => {
			const json = io.readPsvSync(testDataPath('psv/basic.psv'));
			assertBasicValid(json, true);
		});
	});

	describe('basic map', () => {
		it('should match expected json', () => {
			const json = io.readPsvSync(testDataPath('psv/basic.psv'), {
				map(row, i, columns) {
					row.height = +row.height;
					return row;
				}
			});
			assertBasicValid(json);
		});
	});

	describe('basic map shorthand', () => {
		it('should match expected json', () => {
			const json = io.readPsvSync(testDataPath('psv/basic.psv'), (row, i, columns) => {
				row.height = +row.height;
				return row;
			});
			assertBasicValid(json);
		});
	});
});
