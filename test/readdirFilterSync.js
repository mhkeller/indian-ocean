/* global describe, it */
const path = require('path');
const chai = require('chai');
const _ = require('underscore');

const io = require('../dist/indian-ocean.cjs.js');

const assert = chai.assert;

describe('readdirFilterSync()', () => {
	describe('empty', () => {
		it('should be empty', () => {
			assert.lengthOf(io.readdirFilterSync(__dirname, { include: 'csv' }), 0);
		});
	});

	describe('actual extension', () => {
		it('should not be empty', () => {
			const dir = path.join(__dirname, 'data', 'csv');
			assert.isAbove(io.readdirFilterSync(dir, { include: 'csv' }).length, 0);
		});
	});

	describe('extension in filename', () => {
		it('should be empty', () => {
			const dir = path.join(__dirname, 'data', 'json');
			assert.lengthOf(io.readdirFilterSync(dir, { include: 'csv' }), 0);
		});
	});

	describe('dirPath in filename', () => {
		it('should match expected output', () => {
			const dir = path.join(__dirname, 'data', 'csv');
			const files = io.readdirFilterSync(dir, { include: 'csv', fullPath: true });
			assert.equal(files.indexOf(path.join(dir, 'basic.csv')), 0);
		});
		it('should match expected output with trailing slash', () => {
			const dir = path.join(__dirname, 'data', 'csv/');
			const files = io.readdirFilterSync(dir, { include: 'csv', fullPath: true });
			assert.equal(files.indexOf(path.join(dir, 'basic.csv')), 0);
		});
	});

	describe('use regex', () => {
		it('should match expected output', () => {
			const dir = path.join(__dirname, 'data', 'mixed');
			const files = io.readdirFilterSync(dir, { include: /\.*/ });
			assert.notEqual(files.indexOf('.hidden-file'), -1);
		});
	});

	describe('all files match', () => {
		it('should be empty', () => {
			const dir = path.join(__dirname, 'data', 'csv');
			assert.lengthOf(io.readdirFilterSync(dir, { exclude: 'csv' }), 0);
		});
	});

	describe('no matching files', () => {
		it('should not be empty', () => {
			const dir = path.join(__dirname, 'data', 'csv');
			assert.isAbove(io.readdirFilterSync(dir, { exclude: 'tsv' }).length, 0);
		});
	});

	describe('extension in filename', () => {
		it('should not be empty', () => {
			const dir = path.join(__dirname, 'data', 'mixed');
			assert.isAbove(io.readdirFilterSync(dir, { exclude: 'csv' }).length, 0);
		});
	});

	describe('dirPath in filename', () => {
		it('should match expected output', () => {
			const dir = path.join(__dirname, 'data', 'other');
			const files = io.readdirFilterSync(dir, { exclude: 'csv', fullPath: true });
			assert.notEqual(files.indexOf(path.join(dir, 'this_is_not_a_csv.txt')), -1);
		});
	});

	describe('get dirs only', () => {
		it('should match expected output', () => {
			const dir = path.join(__dirname, 'data', 'mixed-dirs');
			const files = io.readdirFilterSync(dir, { skipFiles: true });
			assert(_.isEqual(JSON.stringify(files), '["sub-dir-0","sub-dir-1","sub-dir-2"]'));
		});
	});

	describe('get files only, skipDirectories', () => {
		it('should match expected output', () => {
			const dir = path.join(__dirname, 'data', 'mixed-dirs');
			const files = io.readdirFilterSync(dir, { exclude: /^\./, skipDirectories: true });
			assert(_.isEqual(JSON.stringify(files), '["data-0.csv","data-0.json","data-0.tsv","data-1.csv","data-1.json"]'));
		});
	});

	describe('get files only, skipDirs', () => {
		it('should match expected output', () => {
			const dir = path.join(__dirname, 'data', 'mixed-dirs');
			const files = io.readdirFilterSync(dir, { exclude: /^\./, skipDirs: true });
			assert(_.isEqual(JSON.stringify(files), '["data-0.csv","data-0.json","data-0.tsv","data-1.csv","data-1.json"]'));
		});
	});
});
