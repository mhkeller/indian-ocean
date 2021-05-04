/* global describe, it */
const fs = require('fs');
const path = require('path');
const chai = require('chai');
const rimraf = require('rimraf');

const io = require('../dist/indian-ocean.cjs.js');
const testData = require('./data/testData.js');
const { readAssertBasicValid } = require('./assertions');

const assert = chai.assert;

describe('writeDataSync()', () => {
	describe('json', () => {
		it('should write as json', done => {
			const filePath = ['test', 'tmp-write-data-json-sync', 'data.json'];
			io.writeDataSync(filePath.join(path.sep), testData, { makeDirs: true });
			readAssertBasicValid(filePath.join(path.sep));
			rimraf(filePath.slice(0, 2).join(path.sep), { glob: false }, err => {
				assert.equal(err, null);
				done();
			});
		});

		it('should write two json files with shared opts creating different directories', done => {
			const filePath = ['test', 'tmp-write-data-json-sync', 'data.json'];
			const filePath2 = ['test', 'tmp-write-data-json-sync2', 'data.json'];
			const opts = { makeDirs: true };
			io.writeDataSync(filePath.join(path.sep), testData, opts);
			io.writeDataSync(filePath2.join(path.sep), testData, opts);
			readAssertBasicValid(filePath.join(path.sep));
			readAssertBasicValid(filePath2.join(path.sep));
			rimraf(`${filePath.slice(0, 2).join(path.sep)}*`, err => {
				assert.equal(err, null);
				done();
			});
		});

		it('should write with json replacer fn', done => {
			const filePath = ['test', 'tmp-write-data-json-replacer-fn-sync', 'data.json'];
			const dataString = io.writeDataSync(filePath.join(path.sep), testData, {
				makeDirectories: true,
				replacer(key, value) {
					// Filtering out string properties
					if (typeof value === 'string') {
						return undefined;
					}
					return value;
				}
			});
			assert.equal(dataString, '[{"height":70},{"height":63}]');
			assert.equal(fs.readFileSync(filePath.join(path.sep), 'utf-8'), dataString);
			rimraf(filePath.slice(0, 2).join(path.sep), { glob: false }, err => {
				assert.equal(err, null);
				done();
			});
		});

		it('should write with json replacer array', done => {
			const filePath = ['test', 'tmp-write-data-json-replacer-array-sync', 'data.json'];
			const dataString = io.writeDataSync(filePath.join(path.sep), testData, {
				makeDirectories: true,
				replacer: ['height']
			});
			assert.equal(dataString, '[{"height":70},{"height":63}]');
			assert.equal(fs.readFileSync(filePath.join(path.sep), 'utf-8'), dataString);
			rimraf(filePath.slice(0, 2).join(path.sep), { glob: false }, err => {
				assert.equal(err, null);
				done();
			});
		});

		it('should write with json indent', done => {
			const filePath = ['test', 'tmp-write-data-json-indent-sync', 'data.json'];
			const dataString = io.writeDataSync(filePath.join(path.sep), testData, {
				makeDirs: true,
				indent: 2
			});
			assert.equal(dataString, '[\n  {\n    "name": "jim",\n    "occupation": "land surveyor",\n    "height": 70\n  },\n  {\n    "name": "francis",\n    "occupation": "conductor",\n    "height": 63\n  }\n]');
			assert.equal(fs.readFileSync(filePath.join(path.sep), 'utf-8'), dataString);
			rimraf(filePath.slice(0, 2).join(path.sep), { glob: false }, err => {
				assert.equal(err, null);
				done();
			});
		});

		it('should write as json without making directory', done => {
			const filePath = ['test', 'test-out-data-sync.json'];
			io.writeDataSync(filePath.join(path.sep), testData);
			readAssertBasicValid(filePath.join(path.sep));
			rimraf(filePath.join(path.sep), { glob: false }, err => {
				assert.equal(err, null);
				done();
			});
		});
	});

	describe('geojson', () => {
		it('should write as geojson', done => {
			const filePath = ['test', 'tmp-write-data-geojson-sync', 'data.geojson'];
			io.writeDataSync(filePath.join(path.sep), testData, { makeDirectories: true });
			readAssertBasicValid(filePath.join(path.sep));
			rimraf(filePath.slice(0, 2).join(path.sep), { glob: false }, err => {
				assert.equal(err, null);
				done();
			});
		});
	});

	describe('topojson', () => {
		it('should write as topojson', done => {
			const filePath = ['test', 'tmp-write-data-topojson-sync', 'data.topojson'];
			io.writeDataSync(filePath.join(path.sep), testData, { makeDirectories: true });
			readAssertBasicValid(filePath.join(path.sep));
			rimraf(filePath.slice(0, 2).join(path.sep), { glob: false }, err => {
				assert.equal(err, null);
				done();
			});
		});
	});

	describe('geojson', () => {
		it('should write as geojson with indent', done => {
			const filePath = ['test', 'tmp-write-data-geojson-indent-sync', 'data.geojson'];
			const dataString = io.writeDataSync(filePath.join(path.sep), testData, {
				makeDirectories: true,
				indent: 2
			});
			assert.equal(dataString, '[\n  {\n    "name": "jim",\n    "occupation": "land surveyor",\n    "height": 70\n  },\n  {\n    "name": "francis",\n    "occupation": "conductor",\n    "height": 63\n  }\n]');
			assert.equal(fs.readFileSync(filePath.join(path.sep), 'utf-8'), dataString);
			rimraf(filePath.slice(0, 2).join(path.sep), { glob: false }, err => {
				assert.equal(err, null);
				done();
			});
		});
	});

	describe('topojson', () => {
		it('should write as topojson with indent', done => {
			const filePath = ['test', 'tmp-write-data-topojson-indent-sync', 'data.topojson'];
			const dataString = io.writeDataSync(filePath.join(path.sep), testData, {
				makeDirectories: true,
				indent: 2
			});
			assert.equal(dataString, '[\n  {\n    "name": "jim",\n    "occupation": "land surveyor",\n    "height": 70\n  },\n  {\n    "name": "francis",\n    "occupation": "conductor",\n    "height": 63\n  }\n]');
			assert.equal(fs.readFileSync(filePath.join(path.sep), 'utf-8'), dataString);
			rimraf(filePath.slice(0, 2).join(path.sep), { glob: false }, err => {
				assert.equal(err, null);
				done();
			});
		});
	});

	describe('csv', () => {
		it('should write as csv', done => {
			const filePath = ['test', 'tmp-write-data-csv-sync', 'data.csv'];
			io.writeDataSync(filePath.join(path.sep), testData, { makeDirectories: true });
			readAssertBasicValid(filePath.join(path.sep));
			rimraf(filePath.slice(0, 2).join(path.sep), { glob: false }, err => {
				assert.equal(err, null);
				done();
			});
		});
	});

	describe('tsv', () => {
		it('should write as tsv', done => {
			const filePath = ['test', 'tmp-write-data-tsv-sync', 'data.tsv'];
			io.writeDataSync(filePath.join(path.sep), testData, { makeDirectories: true });
			readAssertBasicValid(filePath.join(path.sep));
			rimraf(filePath.slice(0, 2).join(path.sep), { glob: false }, err => {
				assert.equal(err, null);
				done();
			});
		});
	});

	describe('psv', () => {
		it('should write as psv', done => {
			const filePath = ['test', 'tmp-write-data-psv-sync', 'data.psv'];
			io.writeDataSync(filePath.join(path.sep), testData, { makeDirectories: true });
			readAssertBasicValid(filePath.join(path.sep));
			rimraf(filePath.slice(0, 2).join(path.sep), { glob: false }, err => {
				assert.equal(err, null);
				done();
			});
		});
	});
});
