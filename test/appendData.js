/* global describe, it */
const chai = require('chai');
const path = require('path');
const rimraf = require('rimraf');

const assert = chai.assert;

const io = require('../dist/indian-ocean.cjs.js');
const testData = require('./data/testData.js');

const {
	readAssertBasicValid,
	readAssertBasicValidObject
} = require('./assertions/index.js');

describe('appendData()', () => {
	describe('json', () => {
		it('should append to existing json', done => {
			const filePathArr = ['test', 'tmp-append-data-json', 'data.json'];
			const filePath = filePathArr.join(path.sep);
			io.writeDataSync(filePath, [testData[0]], { makeDirectories: true });
			io.appendData(filePath, [testData[1]], err => {
				assert.equal(err, null);
				readAssertBasicValid(filePath);
				rimraf(filePathArr.slice(0, 2).join(path.sep), { glob: false }, err2 => {
					assert.equal(err2, null);
					done();
				});
			});
		});
	});

	describe('geojson', () => {
		it('should append to existing geojson', done => {
			const filePath = ['test', 'tmp-append-data-geojson', 'data.geojson'];
			io.writeDataSync(filePath.join(path.sep), [testData[0]], { makeDirectories: true });
			io.appendData(filePath.join(path.sep), [testData[1]], err => {
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
		it('should append to existing topojson', done => {
			const filePath = ['test', 'tmp-append-data-topojson', 'data.topojson'];
			io.writeDataSync(filePath.join(path.sep), [testData[0]], { makeDirectories: true });
			io.appendData(filePath.join(path.sep), [testData[1]], err => {
				assert.equal(err, null);
				readAssertBasicValid(filePath.join(path.sep));
				rimraf(filePath.slice(0, 2).join(path.sep), { glob: false }, err2 => {
					assert.equal(err2, null);
					done();
				});
			});
		});
	});

	describe('csv', () => {
		it('should append to existing csv', done => {
			const filePath = ['test', 'tmp-append-data-csv', 'data.csv'];
			io.writeDataSync(filePath.join(path.sep), [testData[0]], { makeDirectories: true });
			io.appendData(filePath.join(path.sep), [testData[1]], err => {
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
		it('should append to existing tsv', done => {
			const filePath = ['test', 'tmp-append-data-tsv', 'data.tsv'];
			io.writeDataSync(filePath.join(path.sep), [testData[0]], { makeDirectories: true });
			io.appendData(filePath.join(path.sep), [testData[1]], err => {
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
		it('should append to existing psv', done => {
			const filePath = ['test', 'tmp-append-data-psv', 'data.psv'];
			io.writeDataSync(filePath.join(path.sep), [testData[0]], { makeDirectories: true });
			io.appendData(filePath.join(path.sep), [testData[1]], err => {
				assert.equal(err, null);
				readAssertBasicValid(filePath.join(path.sep));
				rimraf(filePath.slice(0, 2).join(path.sep), { glob: false }, err2 => {
					assert.equal(err2, null);
					done();
				});
			});
		});
	});

	describe('json', () => {
		it('should append to non-existent json', done => {
			const filePath = ['test', 'tmp-append-new-data-json', 'data.json'];
			io.appendData(filePath.join(path.sep), testData, { makeDirectories: true }, err => {
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
		it('should append to non-existent geojson', done => {
			const filePath = ['test', 'tmp-append-new-data-geojson', 'data.geojson'];
			io.appendData(filePath.join(path.sep), testData, { makeDirectories: true }, err => {
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
		it('should append to non-existent topojson', done => {
			const filePath = ['test', 'tmp-append-new-data-topojson', 'data.topojson'];
			io.appendData(filePath.join(path.sep), testData, { makeDirectories: true }, err => {
				assert.equal(err, null);
				readAssertBasicValid(filePath.join(path.sep));
				rimraf(filePath.slice(0, 2).join(path.sep), { glob: false }, err2 => {
					assert.equal(err2, null);
					done();
				});
			});
		});
	});

	describe('csv', () => {
		it('should append to non-existent csv', done => {
			const filePath = ['test', 'tmp-append-new-data-csv', 'data.csv'];
			io.appendData(filePath.join(path.sep), testData, { makeDirs: true }, err => {
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
		it('should append to non-existent tsv', done => {
			const filePath = ['test', 'tmp-append-new-data-tsv', 'data.tsv'];
			io.appendData(filePath.join(path.sep), testData, { makeDirectories: true }, err => {
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
		it('should append to non-existent psv', done => {
			const filePath = ['test', 'tmp-append-new-data-psv', 'data.psv'];
			io.appendData(filePath.join(path.sep), testData, { makeDirectories: true }, err => {
				assert.equal(err, null);
				readAssertBasicValid(filePath.join(path.sep));
				rimraf(filePath.slice(0, 2).join(path.sep), { glob: false }, err2 => {
					assert.equal(err2, null);
					done();
				});
			});
		});
	});

	describe('json-object', () => {
		it('should append to existing json-object', done => {
			const filePath = ['test', 'tmp-append-data-json-object', 'data.json'];
			io.writeDataSync(filePath.join(path.sep), testData[0], { makeDirectories: true });
			io.appendData(filePath.join(path.sep), testData[1], err => {
				assert.equal(err, null);
				readAssertBasicValidObject(filePath.join(path.sep), 1);
				rimraf(filePath.slice(0, 2).join(path.sep), { glob: false }, err2 => {
					assert.equal(err2, null);
					done();
				});
			});
		});
	});

	describe('json-object', () => {
		it('should append to non-existent json-object', done => {
			const filePath = ['test', 'tmp-append-new-data-json-object', 'data.json'];
			io.appendData(filePath.join(path.sep), testData[1], { makeDirectories: true }, err => {
				assert.equal(err, null);
				readAssertBasicValidObject(filePath.join(path.sep), 1);
				rimraf(filePath.slice(0, 2).join(path.sep), { glob: false }, err2 => {
					assert.equal(err2, null);
					done();
				});
			});
		});
	});
});
