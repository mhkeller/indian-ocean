/* global describe, it */
const chai = require('chai');

const io = require('../dist/indian-ocean.cjs.js');
const testDataPath = require('./utils/testDataPath');

const assert = chai.assert;

describe('exists()', () => {
	describe('exists', () => {
		it('should be true', done => {
			io.exists(testDataPath('csv/basic.csv'), (err, exists) => {
				assert.equal(err, null);
				assert.equal(exists, true);
				done();
			});
		});
	});
	describe('does not exist', () => {
		it('should be false', done => {
			io.exists(testDataPath('csv/doesnt-exist.csv'), (err, exists) => {
				assert.equal(err, null);
				assert.equal(exists, false);
				done();
			});
		});
	});
});
