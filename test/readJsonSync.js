/* global describe, it */
const chai = require('chai');
const _ = require('underscore');

const io = require('../dist/indian-ocean.cjs.js');
const testDataPath = require('./utils/testDataPath');

const { assertBasicValid } = require('./assertions');

const assert = chai.assert;

describe('readJsonSync()', () => {
	describe('empty', () => {
		it('should be empty', () => {
			assert.lengthOf(io.readJsonSync(testDataPath('json/empty.json')), 0);
		});
	});

	describe('basic', () => {
		it('should match expected json', () => {
			const json = io.readJsonSync(testDataPath('json/basic.json'));
			assertBasicValid(json);
		});
	});

	describe('basic', () => {
		it('should match expected geojson', () => {
			const json = io.readJsonSync(testDataPath('geojson/basic.geojson'));
			assertBasicValid(json);
		});
	});

	describe('basic', () => {
		it('should match expected topojson', () => {
			const json = io.readJsonSync(testDataPath('topojson/basic.topojson'));
			assertBasicValid(json);
		});
	});

	describe('basic map', () => {
		it('should use map', () => {
			const json = io.readJsonSync(testDataPath('json/basic.json'), {
				map(row, i) {
					row.height *= 2;
					return row;
				}
			});
			assert(_.isEqual(JSON.stringify(json), '[{"name":"jim","occupation":"land surveyor","height":140},{"name":"francis","occupation":"conductor","height":126}]'));
		});

		it('should use map', () => {
			const json = io.readJsonSync(testDataPath('json/basic.json'), (row, i) => {
				row.height *= 2;
				return row;
			});
			assert(_.isEqual(JSON.stringify(json), '[{"name":"jim","occupation":"land surveyor","height":140},{"name":"francis","occupation":"conductor","height":126}]'));
		});
	});

	describe('invalid', () => {
		it('should raise an error', () => {
			assert.throws(() => {
				io.readJsonSync(testDataPath('json/invalid.json'));
			}, Error);
		});
	});
});
