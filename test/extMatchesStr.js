/* global describe, it */
const chai = require('chai');
const io = require('../dist/indian-ocean.cjs.js');

const assert = chai.assert;

describe('extMatchesStr()', () => {
	it('should match the given extension', () => {
		assert.equal(io.extMatchesStr('csv/basic.csv', 'csv'), true);
	});

	it('should not match the given extension', () => {
		assert.equal(io.extMatchesStr('csv/basic.csv', 'tsv'), false);
	});

	it('should match no extension', () => {
		assert.equal(io.extMatchesStr('csv/basic', ''), true);
	});

	it('should match dotfile', () => {
		assert.equal(io.extMatchesStr('csv/basic/.gitignore', ''), true);
	});
});
