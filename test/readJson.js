/* global describe, it */
const path = require('path');
const chai = require('chai');
const _ = require('underscore');

const io = require('../dist/indian-ocean.cjs.js');
const testDataPath = require('./utils/testDataPath');

const { assertBasicValid } = require('./assertions');

const assert = chai.assert;

describe('readJson()', () => {
	describe('empty', () => {
		it('should be empty', done => {
			io.readJson(testDataPath('json/empty.json'), (err, json) => {
				assert.equal(err, null);
				assert.lengthOf(json, 0);
				done();
			});
		});
	});

	describe('basic', () => {
		it('should match expected json', done => {
			io.readJson(testDataPath('json/basic.json'), (err, json) => {
				assert.equal(err, null);
				assertBasicValid(json);
				done();
			});
		});
	});

	describe('basic map', () => {
		it('should match expected json', done => {
			io.readJson(testDataPath('json/basic.json'), {
				map(row, i) {
					row.height *= 2;
					return row;
				}
			}, (err, json) => {
				assert.equal(err, null);
				assert(_.isEqual(JSON.stringify(json), '[{"name":"jim","occupation":"land surveyor","height":140},{"name":"francis","occupation":"conductor","height":126}]'));
				done();
			});
		});
	});

	describe('basic map shorthand', () => {
		it('should match expected json', done => {
			io.readJson(testDataPath('json/basic.json'), (row, i) => {
				row.height *= 2;
				return row;
			}, (err, json) => {
				assert.equal(err, null);
				assert(_.isEqual(JSON.stringify(json), '[{"name":"jim","occupation":"land surveyor","height":140},{"name":"francis","occupation":"conductor","height":126}]'));
				done();
			});
		});
	});

	describe('invalid', () => {
		it('should raise an error', done => {
			io.readJson(testDataPath('json/invalid.json'), (err, json) => {
				assert.equal(err.message.indexOf('Unexpected token w') > -1, true);
				done();
			});
		});
	});
});
