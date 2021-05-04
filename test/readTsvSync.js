/* global describe, it */
const chai = require('chai');

const io = require('../dist/indian-ocean.cjs.js');
const testDataPath = require('./utils/testDataPath');

const { assertBasicValid } = require('./assertions/index.js');

const assert = chai.assert;

describe('readTsvSync()', () => {
	describe('empty', () => {
		it('should be empty', () => {
			assert.lengthOf(io.readTsvSync(testDataPath('tsv/empty.tsv')), 0);
		});
	});

	describe('basic', () => {
		it('should match expected json', () => {
			const json = io.readTsvSync(testDataPath('tsv/basic.tsv'));
			assertBasicValid(json, true);
		});
	});

	describe('basic map', () => {
		it('should match expected json', () => {
			const json = io.readTsvSync(testDataPath('tsv/basic.tsv'), {
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
			const json = io.readTsvSync(testDataPath('tsv/basic.tsv'), (row, i, columns) => {
				row.height = +row.height;
				return row;
			});
			assertBasicValid(json);
		});
	});
});
