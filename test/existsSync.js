/* global describe, it */
const path = require('path');
const chai = require('chai');
const io = require('../dist/indian-ocean.cjs.js');

const assert = chai.assert;

describe('existsSync()', () => {
	const dir = path.join(__dirname, 'data', 'csv');
	describe('exists', () => {
		it('should be true', () => {
			const exists = io.existsSync(path.join(dir, 'basic.csv'));
			assert.equal(exists, true);
		});
	});
	describe('does not exist', () => {
		it('should be false', () => {
			const exists = io.existsSync(path.join(dir, 'doesnt-exist.csv'));
			assert.equal(exists, false);
		});
	});
});
