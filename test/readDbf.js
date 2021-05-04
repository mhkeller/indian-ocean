/* global describe, it */
const chai = require('chai');
const _ = require('underscore');

const io = require('../dist/indian-ocean.cjs.js');
const testDataPath = require('./utils/testDataPath');

const assert = chai.assert;

describe('readDbf()', () => {
	describe('empty', () => {
		it('should be empty array', done => {
			io.readDbf(testDataPath('dbf/empty.dbf'), err => {
				assert.equal(err.split('\n')[0], 'TypeError: Cannot read property \'buffer\' of null');
				done();
			});
		});
	});

	describe('basic', () => {
		it('should match expected json', done => {
			io.readDbf(testDataPath('dbf/basic.dbf'), (err, json) => {
				assert.equal(err, null);
				assert(_.isEqual(JSON.stringify(json), '[{"foo":"orange","bar":0},{"foo":"blue","bar":1},{"foo":"green","bar":2}]'));
				done();
			});
		});
	});

	describe('basic map', () => {
		it('should match expected json', done => {
			io.readDbf(testDataPath('dbf/basic.dbf'), {
				map(row) {
					row.bar *= 2;
					return row;
				}
			}, (err, json) => {
				assert.equal(err, null);
				assert(_.isEqual(JSON.stringify(json), '[{"foo":"orange","bar":0},{"foo":"blue","bar":2},{"foo":"green","bar":4}]'));
				done();
			});
		});
	});

	describe('basic map shorthand', () => {
		it('should match expected json', done => {
			io.readDbf(testDataPath('dbf/basic.dbf'), row => {
				row.bar *= 2;
				return row;
			}, (err, json) => {
				assert.equal(err, null);
				assert(_.isEqual(JSON.stringify(json), '[{"foo":"orange","bar":0},{"foo":"blue","bar":2},{"foo":"green","bar":4}]'));
				done();
			});
		});
	});
});
