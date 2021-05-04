/* global describe, it */
const chai = require('chai');

const io = require('../dist/indian-ocean.cjs.js');

const assert = chai.assert;

describe('matchesRegExp()', () => {
	it('should match the regex with a dotfile', () => {
		assert.equal(io.matchesRegExp('.gitignore', /\.gitignore/), true);
	});

	it('should match the regex with a normal file', () => {
		assert.equal(io.matchesRegExp('data.csv', /\.csv$/), true);
	});

	it('should not match the regex', () => {
		assert.equal(io.matchesRegExp('.gitignore', /csv/), false);
	});

	it('should match the full path', () => {
		assert.equal(io.matchesRegExp('path/to/file/basic.csv', /\/file\//), true);
	});
});
