/* global describe, it */
const path = require('path');
const chai = require('chai');
const _ = require('underscore');

const io = require('../dist/indian-ocean.cjs.js');

const assert = chai.assert;

describe('readdirFilter()', () => {
	describe('empty', () => {
		it('should be empty', done => {
			io.readdirFilter(__dirname, { include: 'csv' }, (err, files) => {
				assert.equal(err, null);
				assert.lengthOf(files, 0);
				done();
			});
		});
	});

	describe('no options passed', () => {
		it('should match expected output', done => {
			const dir = path.join(__dirname, 'data', 'csv');
			io.readdirFilter(dir, (err, files) => {
				assert.equal(err, null);
				assert.lengthOf(files, 2);
				done();
			});
		});
	});

	describe('include by extension', () => {
		it('should match expected output', done => {
			const dir = path.join(__dirname, 'data', 'csv');
			io.readdirFilter(dir, { include: 'csv' }, (err, files) => {
				assert.equal(err, null);
				assert.lengthOf(files, 2);
				done();
			});
		});
	});

	describe('include by single list', () => {
		it('should match expected output', done => {
			const dir = path.join(__dirname, 'data', 'csv');
			io.readdirFilter(dir, { include: ['csv'] }, (err, files) => {
				assert.equal(err, null);
				assert.lengthOf(files, 2);
				done();
			});
		});
	});

	describe('include by extension list', () => {
		it('should match expected output', done => {
			const dir = path.join(__dirname, 'data', 'mixed');
			io.readdirFilter(dir, { include: ['csv', 'tsv'] }, (err, files) => {
				assert.equal(err, null);
				assert(_.isEqual(JSON.stringify(files), '["data-0.csv","data-0.tsv","data-1.csv"]'));
				done();
			});
		});
	});

	describe('include by extension list and regex', () => {
		it('should match expected output', done => {
			const dir = path.join(__dirname, 'data', 'mixed');
			io.readdirFilter(dir, { include: ['csv', 'tsv', /hidden/] }, (err, files) => {
				assert.equal(err, null);
				assert(_.isEqual(JSON.stringify(files), '[".hidden-file","data-0.csv","data-0.tsv","data-1.csv"]'));
				done();
			});
		});
	});

	describe('dirPath in filename', () => {
		it('should match expected output', done => {
			const dir = path.join(__dirname, 'data', 'csv');
			io.readdirFilter(dir, { include: 'csv', fullPath: true }, (err, files) => {
				assert.equal(err, null);
				done(assert.equal(files.indexOf(path.join(dir, 'basic.csv')), 0));
			});
		});
	});

	describe('all files match', () => {
		it('should be empty', done => {
			const dir = path.join(__dirname, 'data', 'csv');
			io.readdirFilter(dir, { exclude: 'csv' }, (err, files) => {
				assert.equal(err, null);
				assert.lengthOf(files, 0);
				done();
			});
		});
	});

	describe('exclude by extension', () => {
		it('should match expected out', done => {
			const dir = path.join(__dirname, 'data', 'mixed');
			io.readdirFilter(dir, { exclude: 'tsv' }, (err, files) => {
				assert.equal(err, null);
				assert(_.isEqual(JSON.stringify(files), '[".hidden-file","data-0.csv","data-0.json","data-1.csv","data-1.json"]'));
				done();
			});
		});
	});

	describe('exclude by extension list', () => {
		it('match expected output', done => {
			const dir = path.join(__dirname, 'data', 'mixed');
			io.readdirFilter(dir, { exclude: ['tsv', 'csv'] }, (err, files) => {
				assert.equal(err, null);
				assert(_.isEqual(JSON.stringify(files), '[".hidden-file","data-0.json","data-1.json"]'));
				done();
			});
		});
	});

	describe('include and exclude by regex and extension list', () => {
		it('match expected output', done => {
			const dir = path.join(__dirname, 'data', 'mixed');
			io.readdirFilter(dir, { exclude: ['tsv', 'csv'], include: /^data/ }, (err, files) => {
				assert.equal(err, null);
				assert(_.isEqual(JSON.stringify(files), '["data-0.json","data-1.json"]'));
				done();
			});
		});
	});

	describe('includeMatchAll', () => {
		it('match expected output', done => {
			const dir = path.join(__dirname, 'data', 'mixed');
			io.readdirFilter(dir, { include: [/^data-1/, 'json'], includeMatchAll: true }, (err, files) => {
				assert.equal(err, null);
				assert(_.isEqual(JSON.stringify(files), '["data-1.json"]'));
				done();
			});
		});
	});

	describe('excludeMatchAll', () => {
		it('match expected output', done => {
			const dir = path.join(__dirname, 'data', 'mixed');
			io.readdirFilter(dir, { exclude: [/^data-1/, 'json'], excludeMatchAll: true }, (err, files) => {
				assert.equal(err, null);
				assert(_.isEqual(JSON.stringify(files), '[".hidden-file","data-0.csv","data-0.json","data-0.tsv","data-1.csv"]'));
				done();
			});
		});
	});

	describe('exclude by extension list and regex', () => {
		it('match expected output', done => {
			const dir = path.join(__dirname, 'data', 'mixed');
			io.readdirFilter(dir, { exclude: ['tsv', 'csv', /^\./] }, (err, files) => {
				assert.equal(err, null);
				assert(_.isEqual(JSON.stringify(files), '["data-0.json","data-1.json"]'));
				done();
			});
		});
	});

	describe('exclude by extension list and skipHidden', () => {
		it('match expected output', done => {
			const dir = path.join(__dirname, 'data', 'mixed');
			io.readdirFilter(dir, { exclude: ['tsv', 'csv'], skipHidden: true }, (err, files) => {
				assert.equal(err, null);
				assert(_.isEqual(JSON.stringify(files), '["data-0.json","data-1.json"]'));
				done();
			});
		});
	});

	describe('dirPath in filename', () => {
		it('should match expected output', done => {
			const dir = path.join(__dirname, 'data', 'other');
			io.readdirFilter(dir, { exclude: 'csv', fullPath: true }, (err, files) => {
				assert.equal(err, null);
				done(assert.notEqual(files.indexOf(path.join(dir, 'this_is_not_a_csv.txt')), -1));
			});
		});
		it('should match expected output stripping trailing slash', done => {
			const dir = path.join(__dirname, 'data', 'other/');
			io.readdirFilter(dir, { exclude: 'csv', fullPath: true }, (err, files) => {
				assert.equal(err, null);
				done(assert.notEqual(files.indexOf(path.join(dir, 'this_is_not_a_csv.txt')), -1));
			});
		});
	});

	describe('get dirs only', () => {
		it('should match expected output', done => {
			const dir = path.join(__dirname, 'data', 'mixed-dirs');
			io.readdirFilter(dir, { skipFiles: true }, (err, files) => {
				assert.equal(err, null);
				assert(_.isEqual(JSON.stringify(files), '["sub-dir-0","sub-dir-1","sub-dir-2"]'));
				done();
			});
		});
	});

	describe('get files only', () => {
		it('should match expected output', done => {
			const dir = path.join(__dirname, 'data', 'mixed-dirs');
			io.readdirFilter(dir, { exclude: /^\./, skipDirectories: true }, (err, files) => {
				assert.equal(err, null);
				assert(_.isEqual(JSON.stringify(files), '["data-0.csv","data-0.json","data-0.tsv","data-1.csv","data-1.json"]'));
				done();
			});
		});
	});
});
