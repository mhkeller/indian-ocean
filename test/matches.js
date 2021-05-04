/* global describe, it */
const chai = require('chai');

const io = require('../dist/indian-ocean.cjs.js');

const assert = chai.assert;

describe('matches()', () => {
	describe('string', () => {
		it('should match string name', () => {
			assert.equal(io.matches('path/to/data.csv', 'csv'), true);
		});
	});

	describe('regex', () => {
		it('should match regex name', () => {
			assert.equal(io.matches('path/to/data.csv', /csv$/), true);
		});
	});
});
