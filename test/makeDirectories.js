/* global describe, it */
const chai = require('chai');
const path = require('path');
const rimraf = require('rimraf');

const io = require('../dist/indian-ocean.cjs.js');

const assert = chai.assert;

describe('makeDirectories()', () => {
	it('should make multiple directories', done => {
		const filePath = ['test', 'tmp-md', 'one', 'two', 'three', 'file.txt'];
		io.makeDirectories(filePath.join(path.sep), err => {
			assert.equal(err, null);
			filePath.pop();
			assert.equal(io.existsSync(filePath.join(path.sep)), true);
			rimraf(filePath.slice(0, 2).join(path.sep), { glob: false }, err => {
				assert.equal(err, null);
				done();
			});
		});
	});
});
