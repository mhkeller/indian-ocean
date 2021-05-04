/* global describe, it */
const fs = require('fs');
const path = require('path');
const chai = require('chai');
const rimraf = require('rimraf');

const io = require('../dist/indian-ocean.cjs.js');

const testData = require('./data/testData.js');

const { readAssertBasicValid } = require('./assertions/index.js');

const assert = chai.assert;

describe('writeData()', () => {
	describe('json', () => {
		it('should write as json', done => {
			const filePath = ['test', 'tmp-write-data-json', 'data.json'];
			io.writeData(filePath.join(path.sep), testData, { makeDirs: true }, err => {
				assert.equal(err, null);
				readAssertBasicValid(filePath.join(path.sep));
				rimraf(filePath.slice(0, 2).join(path.sep), { glob: false }, err2 => {
					assert.equal(err2, null);
					done();
				});
			});
		});

		it('should write with json replacer fn', done => {
			const filePath = ['test', 'tmp-write-data-json-replacer-fn', 'data.json'];
			io.writeData(filePath.join(path.sep), testData, {
				makeDirs: true,
				replacer(key, value) {
					// Filtering out string properties
					if (typeof value === 'string') {
						return undefined;
					}
					return value;
				}
			}, (err, dataString) => {
				assert.equal(err, null);
				assert.equal(dataString, '[{"height":70},{"height":63}]');
				assert.equal(fs.readFileSync(filePath.join(path.sep), 'utf-8'), dataString);
				rimraf(filePath.slice(0, 2).join(path.sep), { glob: false }, err2 => {
					assert.equal(err2, null);
					done();
				});
			});
		});

		it('should write with json replacer array', done => {
			const filePath = ['test', 'tmp-write-data-json-replacer-array', 'data.json'];
			io.writeData(filePath.join(path.sep), testData, {
				makeDirs: true,
				replacer: ['height']
			}, (err, dataString) => {
				assert.equal(err, null);
				assert.equal(dataString, '[{"height":70},{"height":63}]');
				assert.equal(fs.readFileSync(filePath.join(path.sep), 'utf-8'), dataString);
				rimraf(filePath.slice(0, 2).join(path.sep), { glob: false }, err2 => {
					assert.equal(err2, null);
					done();
				});
			});
		});

		it('should write with json indent', done => {
			const filePath = ['test', 'tmp-write-data-json-indent', 'data.json'];
			io.writeData(filePath.join(path.sep), testData, {
				makeDirs: true,
				indent: 2
			}, (err, dataString) => {
				assert.equal(err, null);
				assert.equal(dataString, '[\n  {\n    "name": "jim",\n    "occupation": "land surveyor",\n    "height": 70\n  },\n  {\n    "name": "francis",\n    "occupation": "conductor",\n    "height": 63\n  }\n]');
				assert.equal(fs.readFileSync(filePath.join(path.sep), 'utf-8'), dataString);
				rimraf(filePath.slice(0, 2).join(path.sep), { glob: false }, err2 => {
					assert.equal(err2, null);
					done();
				});
			});
		});

		it('should write as json without making directory', done => {
			const filePath = ['test', 'test-out-data.json'];
			io.writeData(filePath.join(path.sep), testData, err => {
				assert.equal(err, null);
				readAssertBasicValid(filePath.join(path.sep));
				rimraf(filePath.join(path.sep), { glob: false }, err2 => {
					assert.equal(err2, null);
					done();
				});
			});
		});
	});

	describe('geojson', () => {
		it('should write as geojson', done => {
			const filePath = ['test', 'tmp-write-data-geojson', 'data.geojson'];
			io.writeData(filePath.join(path.sep), testData, { makeDirs: true }, err => {
				assert.equal(err, null);
				readAssertBasicValid(filePath.join(path.sep));
				rimraf(filePath.slice(0, 2).join(path.sep), { glob: false }, err2 => {
					assert.equal(err2, null);
					done();
				});
			});
		});
	});

	describe('topojson', () => {
		it('should write as topojson', done => {
			const filePath = ['test', 'tmp-write-data-topojson', 'data.topojson'];
			io.writeData(filePath.join(path.sep), testData, { makeDirs: true }, err => {
				assert.equal(err, null);
				readAssertBasicValid(filePath.join(path.sep));
				rimraf(filePath.slice(0, 2).join(path.sep), { glob: false }, err2 => {
					assert.equal(err2, null);
					done();
				});
			});
		});
	});

	describe('geojson', () => {
		it('should write as geojson with indent', done => {
			const filePath = ['test', 'tmp-write-data-geojson-indent', 'data.geojson'];
			io.writeData(filePath.join(path.sep), testData, {
				makeDirs: true,
				indent: 2
			}, (err, dataString) => {
				assert.equal(err, null);
				assert.equal(dataString, '[\n  {\n    "name": "jim",\n    "occupation": "land surveyor",\n    "height": 70\n  },\n  {\n    "name": "francis",\n    "occupation": "conductor",\n    "height": 63\n  }\n]');
				assert.equal(fs.readFileSync(filePath.join(path.sep), 'utf-8'), dataString);
				rimraf(filePath.slice(0, 2).join(path.sep), { glob: false }, err2 => {
					assert.equal(err2, null);
					done();
				});
			});
		});
	});

	describe('topojson', () => {
		it('should write as topojson with indent', done => {
			const filePath = ['test', 'tmp-write-data-topojson-indent', 'data.topojson'];
			io.writeData(filePath.join(path.sep), testData, {
				makeDirs: true,
				indent: 2
			}, (err, dataString) => {
				assert.equal(err, null);
				assert.equal(dataString, '[\n  {\n    "name": "jim",\n    "occupation": "land surveyor",\n    "height": 70\n  },\n  {\n    "name": "francis",\n    "occupation": "conductor",\n    "height": 63\n  }\n]');
				assert.equal(fs.readFileSync(filePath.join(path.sep), 'utf-8'), dataString);
				rimraf(filePath.slice(0, 2).join(path.sep), { glob: false }, err2 => {
					assert.equal(err2, null);
					done();
				});
			});
		});
	});

	describe('csv', () => {
		it('should write as csv', done => {
			const filePath = ['test', 'tmp-write-data-csv', 'data.csv'];
			io.writeData(filePath.join(path.sep), testData, { makeDirs: true }, err => {
				assert.equal(err, null);
				readAssertBasicValid(filePath.join(path.sep));
				rimraf(filePath.slice(0, 2).join(path.sep), { glob: false }, err2 => {
					assert.equal(err2, null);
					done();
				});
			});
		});
	});

	describe('tsv', () => {
		it('should write as tsv', done => {
			const filePath = ['test', 'tmp-write-data-tsv', 'data.tsv'];
			io.writeData(filePath.join(path.sep), testData, { makeDirs: true }, err => {
				assert.equal(err, null);
				readAssertBasicValid(filePath.join(path.sep));
				rimraf(filePath.slice(0, 2).join(path.sep), { glob: false }, err2 => {
					assert.equal(err2, null);
					done();
				});
			});
		});
	});

	describe('psv', () => {
		it('should write as psv', done => {
			const filePath = ['test', 'tmp-write-data-psv', 'data.psv'];
			io.writeData(filePath.join(path.sep), testData, { makeDirs: true }, err => {
				assert.equal(err, null);
				readAssertBasicValid(filePath.join(path.sep));
				rimraf(filePath.slice(0, 2).join(path.sep), { glob: false }, err2 => {
					assert.equal(err2, null);
					done();
				});
			});
		});
	});
});
