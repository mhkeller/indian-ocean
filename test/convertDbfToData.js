/* global describe, it */
const chai = require('chai');
const path = require('path');
const rimraf = require('rimraf');
const _ = require('underscore');

const assert = chai.assert;

const io = require('../dist/indian-ocean.cjs.js');
const testDataPath = require('./utils/testDataPath.js');

describe('convertDbfToData()', () => {
	describe('csv', () => {
		it('should convert to format', done => {
			const filePath = ['test', 'tmp-convert-dbf-to-data-csv', 'data.csv'];
			io.convertDbfToData(testDataPath('dbf/basic.dbf'), filePath.join(path.sep), { makeDirectories: true }, (err, dataStr) => {
				assert.equal(err, null);
				const result = '[{"foo":"orange","bar":"0"},{"foo":"blue","bar":"1"},{"foo":"green","bar":"2"}]';
				assert(_.isEqual(JSON.stringify(io.discernParser(filePath[filePath.length - 1])(dataStr)), result));
				const json = io.readDataSync(filePath.join(path.sep));
				assert(_.isEqual(JSON.stringify(json), result));
				rimraf(filePath.slice(0, 2).join(path.sep), { glob: false }, err2 => {
					assert.equal(err2, null);
					done();
				});
			});
		});
	});

	describe('psv', () => {
		it('should convert to format', done => {
			const filePath = ['test', 'tmp-convert-dbf-to-data-psv', 'data.psv'];
			io.convertDbfToData(testDataPath('dbf/basic.dbf'), filePath.join(path.sep), { makeDirectories: true }, (err, dataStr) => {
				assert.equal(err, null);
				const result = '[{"foo":"orange","bar":"0"},{"foo":"blue","bar":"1"},{"foo":"green","bar":"2"}]';
				assert(_.isEqual(JSON.stringify(io.discernParser(filePath[filePath.length - 1])(dataStr)), result));
				const json = io.readDataSync(filePath.join(path.sep));
				assert(_.isEqual(JSON.stringify(json), result));
				rimraf(filePath.slice(0, 2).join(path.sep), { glob: false }, err2 => {
					assert.equal(err2, null);
					done();
				});
			});
		});
	});

	describe('tsv', () => {
		it('should convert to format', done => {
			const filePath = ['test', 'tmp-convert-dbf-to-data-tsv', 'data.tsv'];
			io.convertDbfToData(testDataPath('dbf/basic.dbf'), filePath.join(path.sep), { makeDirectories: true }, (err, dataStr) => {
				assert.equal(err, null);
				const result = '[{"foo":"orange","bar":"0"},{"foo":"blue","bar":"1"},{"foo":"green","bar":"2"}]';
				assert(_.isEqual(JSON.stringify(io.discernParser(filePath[filePath.length - 1])(dataStr)), result));
				const json = io.readDataSync(filePath.join(path.sep));
				assert(_.isEqual(JSON.stringify(json), result));
				rimraf(filePath.slice(0, 2).join(path.sep), { glob: false }, err2 => {
					assert.equal(err2, null);
					done();
				});
			});
		});
	});

	describe('json', () => {
		it('should convert to format', done => {
			const filePath = ['test', 'tmp-convert-dbf-to-data-json', 'data.json'];
			io.convertDbfToData(testDataPath('dbf/basic.dbf'), filePath.join(path.sep), { makeDirectories: true }, (err, dataStr) => {
				assert.equal(err, null);
				const result = '[{"foo":"orange","bar":0},{"foo":"blue","bar":1},{"foo":"green","bar":2}]';
				assert(_.isEqual(JSON.stringify(io.discernParser(filePath[filePath.length - 1])(dataStr)), result));
				const json = io.readDataSync(filePath.join(path.sep));
				assert(_.isEqual(JSON.stringify(json), result));
				rimraf(filePath.slice(0, 2).join(path.sep), { glob: false }, err2 => {
					assert.equal(err2, null);
					done();
				});
			});
		});
	});
});
