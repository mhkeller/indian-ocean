/* global describe, it */
const io = require('../dist/indian-ocean.cjs.js');
const chai = require('chai');
const path = require('path');

const assert = chai.assert;
const rimraf = require('rimraf');

const testData = require('./data/testData.js');

const {
	readAssertBasicValid,
	readAssertBasicValidObject
} = require('./assertions/index.js');

describe('appendDataSync()', () => {
	describe('json', () => {
		it('should append to existing json', done => {
			const filePath = ['test', 'tmp-append-data-json-sync', 'data.json'];
			io.writeDataSync(filePath.join(path.sep), [testData[0]], { makeDirectories: true });
			io.appendDataSync(filePath.join(path.sep), [testData[1]]);
			readAssertBasicValid(filePath.join(path.sep));
			rimraf(filePath.slice(0, 2).join(path.sep), { glob: false }, err => {
				assert.equal(err, null);
				done();
			});
		});
	});

	describe('geojson', () => {
		it('should append to existing geojson', done => {
			const filePath = ['test', 'tmp-append-data-geojson-sync', 'data.geojson'];
			io.writeDataSync(filePath.join(path.sep), [testData[0]], { makeDirectories: true });
			io.appendDataSync(filePath.join(path.sep), [testData[1]]);
			readAssertBasicValid(filePath.join(path.sep));
			rimraf(filePath.slice(0, 2).join(path.sep), { glob: false }, err => {
				assert.equal(err, null);
				done();
			});
		});
	});

	describe('topojson', () => {
		it('should append to existing topojson', done => {
			const filePath = ['test', 'tmp-append-data-topojson-sync', 'data.topojson'];
			io.writeDataSync(filePath.join(path.sep), [testData[0]], { makeDirectories: true });
			io.appendDataSync(filePath.join(path.sep), [testData[1]]);
			readAssertBasicValid(filePath.join(path.sep));
			rimraf(filePath.slice(0, 2).join(path.sep), { glob: false }, err => {
				assert.equal(err, null);
				done();
			});
		});
	});

	describe('csv', () => {
		it('should append to existing csv', done => {
			const filePath = ['test', 'tmp-append-data-csv-sync', 'data.csv'];
			io.writeDataSync(filePath.join(path.sep), [testData[0]], { makeDirectories: true });
			io.appendDataSync(filePath.join(path.sep), [testData[1]]);
			readAssertBasicValid(filePath.join(path.sep));
			rimraf(filePath.slice(0, 2).join(path.sep), { glob: false }, err => {
				assert.equal(err, null);
				done();
			});
		});
	});

	describe('tsv', () => {
		it('should append to existing tsv', done => {
			const filePath = ['test', 'tmp-append-data-tsv-sync', 'data.tsv'];
			io.writeDataSync(filePath.join(path.sep), [testData[0]], { makeDirectories: true });
			io.appendDataSync(filePath.join(path.sep), [testData[1]]);
			readAssertBasicValid(filePath.join(path.sep));
			rimraf(filePath.slice(0, 2).join(path.sep), { glob: false }, err => {
				assert.equal(err, null);
				done();
			});
		});
	});

	describe('psv', () => {
		it('should append to existing psv', done => {
			const filePath = ['test', 'tmp-append-data-psv', 'data.psv'];
			io.writeDataSync(filePath.join(path.sep), [testData[0]], { makeDirectories: true });
			io.appendDataSync(filePath.join(path.sep), [testData[1]]);
			readAssertBasicValid(filePath.join(path.sep));
			rimraf(filePath.slice(0, 2).join(path.sep), { glob: false }, err => {
				assert.equal(err, null);
				done();
			});
		});
	});

	describe('json', () => {
		it('should append to non-existent json', done => {
			const filePath = ['test', 'tmp-append-new-data-json-sync', 'data.json'];
			io.appendDataSync(filePath.join(path.sep), testData, { makeDirs: true });
			readAssertBasicValid(filePath.join(path.sep));
			rimraf(filePath.slice(0, 2).join(path.sep), { glob: false }, err => {
				assert.equal(err, null);
				done();
			});
		});
	});

	describe('geojson', () => {
		it('should append to non-existent geojson', done => {
			const filePath = ['test', 'tmp-append-new-data-geojson-sync', 'data.geojson'];
			io.appendDataSync(filePath.join(path.sep), testData, { makeDirectories: true });
			readAssertBasicValid(filePath.join(path.sep));
			rimraf(filePath.slice(0, 2).join(path.sep), { glob: false }, err => {
				assert.equal(err, null);
				done();
			});
		});
	});

	describe('topojson', () => {
		it('should append to non-existent topojson', done => {
			const filePath = ['test', 'tmp-append-new-data-topojson-sync', 'data.topojson'];
			io.appendDataSync(filePath.join(path.sep), testData, { makeDirectories: true });
			readAssertBasicValid(filePath.join(path.sep));
			rimraf(filePath.slice(0, 2).join(path.sep), { glob: false }, err => {
				assert.equal(err, null);
				done();
			});
		});
	});

	describe('csv', () => {
		it('should append to non-existent csv', done => {
			const filePath = ['test', 'tmp-append-new-data-csv-sync', 'data.csv'];
			io.appendDataSync(filePath.join(path.sep), testData, { makeDirectories: true });
			readAssertBasicValid(filePath.join(path.sep));
			rimraf(filePath.slice(0, 2).join(path.sep), { glob: false }, err => {
				assert.equal(err, null);
				done();
			});
		});
	});

	describe('tsv', () => {
		it('should append to non-existent tsv', done => {
			const filePath = ['test', 'tmp-append-new-data-tsv-sync', 'data.tsv'];
			io.appendDataSync(filePath.join(path.sep), testData, { makeDirectories: true });
			readAssertBasicValid(filePath.join(path.sep));
			rimraf(filePath.slice(0, 2).join(path.sep), { glob: false }, err => {
				assert.equal(err, null);
				done();
			});
		});
	});

	describe('psv', () => {
		it('should append to non-existent psv', done => {
			const filePath = ['test', 'tmp-append-new-data-psv-sync', 'data.psv'];
			io.appendDataSync(filePath.join(path.sep), testData, { makeDirectories: true });
			readAssertBasicValid(filePath.join(path.sep));
			rimraf(filePath.slice(0, 2).join(path.sep), { glob: false }, err => {
				assert.equal(err, null);
				done();
			});
		});
	});

	describe('json-object', () => {
		it('should append to existing json-object', done => {
			const filePath = ['test', 'tmp-append-data-json-object-sync', 'data.json'];
			io.writeDataSync(filePath.join(path.sep), testData[0], { makeDirectories: true });
			io.appendDataSync(filePath.join(path.sep), testData[1]);
			readAssertBasicValidObject(filePath.join(path.sep), 1);
			rimraf(filePath.slice(0, 2).join(path.sep), { glob: false }, err => {
				assert.equal(err, null);
				done();
			});
		});
	});

	describe('json-object', () => {
		it('should append to non-existent json-object', done => {
			const filePath = ['test', 'tmp-append-new-data-json-object-sync', 'data.json'];
			io.appendDataSync(filePath.join(path.sep), testData[1], { makeDirectories: true });
			readAssertBasicValidObject(filePath.join(path.sep), 1);
			rimraf(filePath.slice(0, 2).join(path.sep), { glob: false }, err => {
				assert.equal(err, null);
				done();
			});
		});
	});
});
