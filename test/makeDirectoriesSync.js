/* global describe, it */
const chai = require('chai');
const path = require('path');
const rimraf = require('rimraf');

const io = require('../dist/indian-ocean.cjs.js');

const assert = chai.assert;

describe('makeDirectoriesSync()', () => {
	it('should make multiple directories', done => {
		const filePath = ['test', 'tmp-mds', 'one', 'two', 'three', 'file.txt'];
		io.makeDirectoriesSync(filePath.join(path.sep));
		filePath.pop();
		assert.equal(io.existsSync(filePath.join(path.sep)), true);
		rimraf(filePath.slice(0, 2).join(path.sep), { glob: false }, err => {
			assert.equal(err, null);
			done();
		});
	});
});
