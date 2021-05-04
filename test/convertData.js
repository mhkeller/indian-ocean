/* global describe, it */
const chai = require('chai');
const rimraf = require('rimraf');
const path = require('path');
const _ = require('underscore');

const io = require('../dist/indian-ocean.cjs.js');

const testDataPath = require('./utils/testDataPath.js');

const assert = chai.assert;

describe('convertData()', () => {
	describe('from dbf to', () => {
		describe('csv', () => {
			it('should convert to format', done => {
				const filePath = ['test', 'tmp-convert-to-data-csv', 'data.csv'];
				io.convertData(testDataPath('dbf/basic.dbf'), filePath.join(path.sep), { makeDirectories: true }, (err, dataStr) => {
					assert.equal(err, null);
					const result = '[{"foo":"orange","bar":"0"},{"foo":"blue","bar":"1"},{"foo":"green","bar":"2"}]';
					assert(_.isEqual(JSON.stringify(io.discernParser(filePath[filePath.length - 1])(dataStr)), result));
					const json = io.readDataSync(filePath.join(path.sep));
					assert(_.isEqual(JSON.stringify(json), result));
					rimraf(filePath.slice(0, 2).join(path.sep), { glob: false }, err => {
						assert.equal(err, null);
						done();
					});
				});
			});
		});

		describe('psv', () => {
			it('should convert to format', done => {
				const filePath = ['test', 'tmp-convert-to-data-psv', 'data.psv'];
				io.convertData(testDataPath('dbf/basic.dbf'), filePath.join(path.sep), { makeDirectories: true }, (err, dataStr) => {
					assert.equal(err, null);
					const result = '[{"foo":"orange","bar":"0"},{"foo":"blue","bar":"1"},{"foo":"green","bar":"2"}]';
					assert(_.isEqual(JSON.stringify(io.discernParser(filePath[filePath.length - 1])(dataStr)), result));
					const json = io.readDataSync(filePath.join(path.sep));
					assert(_.isEqual(JSON.stringify(json), result));
					rimraf(filePath.slice(0, 2).join(path.sep), { glob: false }, err => {
						assert.equal(err, null);
						done();
					});
				});
			});
		});

		describe('tsv', () => {
			it('should convert to format', done => {
				const filePath = ['test', 'tmp-convert-to-data-tsv', 'data.tsv'];
				io.convertData(testDataPath('dbf/basic.dbf'), filePath.join(path.sep), { makeDirectories: true }, (err, dataStr) => {
					assert.equal(err, null);
					const result = '[{"foo":"orange","bar":"0"},{"foo":"blue","bar":"1"},{"foo":"green","bar":"2"}]';
					assert(_.isEqual(JSON.stringify(io.discernParser(filePath[filePath.length - 1])(dataStr)), result));
					const json = io.readDataSync(filePath.join(path.sep));
					assert(_.isEqual(JSON.stringify(json), result));
					rimraf(filePath.slice(0, 2).join(path.sep), { glob: false }, err => {
						assert.equal(err, null);
						done();
					});
				});
			});
		});

		describe('json', () => {
			it('should convert to format', done => {
				const filePath = ['test', 'tmp-convert-to-data-json', 'data.json'];
				io.convertData(testDataPath('dbf/basic.dbf'), filePath.join(path.sep), { makeDirectories: true }, (err, dataStr) => {
					assert.equal(err, null);
					const result = '[{"foo":"orange","bar":0},{"foo":"blue","bar":1},{"foo":"green","bar":2}]';
					assert(_.isEqual(JSON.stringify(io.discernParser(filePath[filePath.length - 1])(dataStr)), result));
					const json = io.readDataSync(filePath.join(path.sep));
					assert(_.isEqual(JSON.stringify(json), result));
					rimraf(filePath.slice(0, 2).join(path.sep), { glob: false }, err => {
						assert.equal(err, null);
						done();
					});
				});
			});
		});
	});

	describe('from csv to', () => {
		describe('dbf', () => {
			it('should convert to format', done => {
				const filePath = ['test', 'tmp-convert-csv-to-data-dbf', 'data.dbf'];
				io.convertData(testDataPath('csv/basic.csv'), filePath.join(path.sep), { makeDirectories: true }, (err, dataStr) => {
					assert.equal(err, null);
					const result = '[{"name":"jim","occupation":"land surveyor","height":"70"},{"name":"francis","occupation":"conductor","height":"63"}]';
					io.readData(filePath.join(path.sep), (err, json) => {
						assert.equal(err, null);
						assert(_.isEqual(JSON.stringify(json), result));
						rimraf(filePath.slice(0, 2).join(path.sep), { glob: false }, err => {
							assert.equal(err, null);
							done();
						});
					});
				});
			});
		});

		describe('psv', () => {
			it('should convert to format', done => {
				const filePath = ['test', 'tmp-convert-csv-to-data-psv', 'data.psv'];
				io.convertData(testDataPath('csv/basic.csv'), filePath.join(path.sep), { makeDirectories: true }, (err, dataStr) => {
					assert.equal(err, null);
					const result = '[{"name":"jim","occupation":"land surveyor","height":"70"},{"name":"francis","occupation":"conductor","height":"63"}]';
					assert(_.isEqual(JSON.stringify(io.discernParser(filePath[filePath.length - 1])(dataStr)), result));
					const json = io.readDataSync(filePath.join(path.sep));
					assert(_.isEqual(JSON.stringify(json), result));
					rimraf(filePath.slice(0, 2).join(path.sep), { glob: false }, err => {
						assert.equal(err, null);
						done();
					});
				});
			});
		});

		describe('tsv', () => {
			it('should convert to format', done => {
				const filePath = ['test', 'tmp-convert-csv-to-data-tsv', 'data.tsv'];
				io.convertData(testDataPath('csv/basic.csv'), filePath.join(path.sep), { makeDirectories: true }, (err, dataStr) => {
					assert.equal(err, null);
					const result = '[{"name":"jim","occupation":"land surveyor","height":"70"},{"name":"francis","occupation":"conductor","height":"63"}]';
					assert(_.isEqual(JSON.stringify(io.discernParser(filePath[filePath.length - 1])(dataStr)), result));
					const json = io.readDataSync(filePath.join(path.sep));
					assert(_.isEqual(JSON.stringify(json), result));
					rimraf(filePath.slice(0, 2).join(path.sep), { glob: false }, err => {
						assert.equal(err, null);
						done();
					});
				});
			});
		});

		describe('json', () => {
			it('should convert to format', done => {
				const filePath = ['test', 'tmp-convert-csv-to-data-json', 'data.json'];
				io.convertData(testDataPath('csv/basic.csv'), filePath.join(path.sep), { makeDirectories: true }, (err, dataStr) => {
					assert.equal(err, null);
					const result = '[{"name":"jim","occupation":"land surveyor","height":"70"},{"name":"francis","occupation":"conductor","height":"63"}]';
					assert(_.isEqual(JSON.stringify(io.discernParser(filePath[filePath.length - 1])(dataStr)), result));
					const json = io.readDataSync(filePath.join(path.sep));
					assert(_.isEqual(JSON.stringify(json), result));
					rimraf(filePath.slice(0, 2).join(path.sep), { glob: false }, err => {
						assert.equal(err, null);
						done();
					});
				});
			});
		});
	});

	describe('from json to', () => {
		describe('csv', () => {
			it('should convert to format', done => {
				const filePath = ['test', 'tmp-convert-json-to-data-csv', 'data.csv'];
				io.convertData(testDataPath('json/basic.json'), filePath.join(path.sep), { makeDirectories: true }, (err, dataStr) => {
					assert.equal(err, null);
					const result = '[{"name":"jim","occupation":"land surveyor","height":"70"},{"name":"francis","occupation":"conductor","height":"63"}]';
					assert(_.isEqual(JSON.stringify(io.discernParser(filePath[filePath.length - 1])(dataStr)), result));
					const json = io.readDataSync(filePath.join(path.sep));
					assert(_.isEqual(JSON.stringify(json), result));
					rimraf(filePath.slice(0, 2).join(path.sep), { glob: false }, err => {
						assert.equal(err, null);
						done();
					});
				});
			});
		});

		describe('psv', () => {
			it('should convert to format', done => {
				const filePath = ['test', 'tmp-convert-json-to-data-psv', 'data.psv'];
				io.convertData(testDataPath('json/basic.json'), filePath.join(path.sep), { makeDirectories: true }, (err, dataStr) => {
					assert.equal(err, null);
					const result = '[{"name":"jim","occupation":"land surveyor","height":"70"},{"name":"francis","occupation":"conductor","height":"63"}]';
					assert(_.isEqual(JSON.stringify(io.discernParser(filePath[filePath.length - 1])(dataStr)), result));
					const json = io.readDataSync(filePath.join(path.sep));
					assert(_.isEqual(JSON.stringify(json), result));
					rimraf(filePath.slice(0, 2).join(path.sep), { glob: false }, err => {
						assert.equal(err, null);
						done();
					});
				});
			});
		});

		describe('tsv', () => {
			it('should convert to format', done => {
				const filePath = ['test', 'tmp-convert-json-to-data-tsv', 'data.tsv'];
				io.convertData(testDataPath('json/basic.json'), filePath.join(path.sep), { makeDirectories: true }, (err, dataStr) => {
					assert.equal(err, null);
					const result = '[{"name":"jim","occupation":"land surveyor","height":"70"},{"name":"francis","occupation":"conductor","height":"63"}]';
					assert(_.isEqual(JSON.stringify(io.discernParser(filePath[filePath.length - 1])(dataStr)), result));
					const json = io.readDataSync(filePath.join(path.sep));
					assert(_.isEqual(JSON.stringify(json), result));
					rimraf(filePath.slice(0, 2).join(path.sep), { glob: false }, err => {
						assert.equal(err, null);
						done();
					});
				});
			});
		});

		describe('dbf', () => {
			it('should convert to format', done => {
				const filePath = ['test', 'tmp-convert-json-to-data-dbf', 'data.dbf'];
				io.convertData(testDataPath('json/basic.json'), filePath.join(path.sep), { makeDirectories: true }, (err, dataStr) => {
					assert.equal(err, null);
					const result = '[{"name":"jim","occupation":"land surveyor","height":70},{"name":"francis","occupation":"conductor","height":63}]';
					io.readData(filePath.join(path.sep), (err, json) => {
						assert.equal(err, null);
						assert(_.isEqual(JSON.stringify(json), result));
						rimraf(filePath.slice(0, 2).join(path.sep), { glob: false }, err => {
							assert.equal(err, null);
							done();
						});
					});
				});
			});
		});
	});

	describe('from psv to', () => {
		describe('csv', () => {
			it('should convert to format', done => {
				const filePath = ['test', 'tmp-convert-psv-to-data-csv', 'data.csv'];
				io.convertData(testDataPath('psv/basic.psv'), filePath.join(path.sep), { makeDirectories: true }, (err, dataStr) => {
					assert.equal(err, null);
					const result = '[{"name":"jim","occupation":"land surveyor","height":"70"},{"name":"francis","occupation":"conductor","height":"63"}]';
					assert(_.isEqual(JSON.stringify(io.discernParser(filePath[filePath.length - 1])(dataStr)), result));
					const json = io.readDataSync(filePath.join(path.sep));
					assert(_.isEqual(JSON.stringify(json), result));
					rimraf(filePath.slice(0, 2).join(path.sep), { glob: false }, err => {
						assert.equal(err, null);
						done();
					});
				});
			});
		});

		describe('dbf', () => {
			it('should convert to format', done => {
				const filePath = ['test', 'tmp-convert-psv-to-data-dbf', 'data.dbf'];
				io.convertData(testDataPath('psv/basic.psv'), filePath.join(path.sep), { makeDirectories: true }, err => {
					assert.equal(err, null);
					io.readData(filePath.join(path.sep), (err, json) => {
						assert.equal(err, null);
						assert(_.isEqual(JSON.stringify(json), '[{"name":"jim","occupation":"land surveyor","height":"70"},{"name":"francis","occupation":"conductor","height":"63"}]'));
						rimraf(filePath.slice(0, 2).join(path.sep), { glob: false }, err => {
							assert.equal(err, null);
							done();
						});
					});
				});
			});
		});

		describe('tsv', () => {
			it('should convert to format', done => {
				const filePath = ['test', 'tmp-convert-psv-to-data-tsv', 'data.tsv'];
				io.convertData(testDataPath('psv/basic.psv'), filePath.join(path.sep), { makeDirectories: true }, (err, dataStr) => {
					assert.equal(err, null);
					const result = '[{"name":"jim","occupation":"land surveyor","height":"70"},{"name":"francis","occupation":"conductor","height":"63"}]';
					assert(_.isEqual(JSON.stringify(io.discernParser(filePath[filePath.length - 1])(dataStr)), result));
					const json = io.readDataSync(filePath.join(path.sep));
					assert(_.isEqual(JSON.stringify(json), result));
					rimraf(filePath.slice(0, 2).join(path.sep), { glob: false }, err => {
						assert.equal(err, null);
						done();
					});
				});
			});
		});

		describe('json', () => {
			it('should convert to format', done => {
				const filePath = ['test', 'tmp-convert-psv-to-data-json', 'data.json'];
				io.convertData(testDataPath('psv/basic.psv'), filePath.join(path.sep), { makeDirectories: true }, (err, dataStr) => {
					assert.equal(err, null);
					const result = '[{"name":"jim","occupation":"land surveyor","height":"70"},{"name":"francis","occupation":"conductor","height":"63"}]';
					assert(_.isEqual(JSON.stringify(io.discernParser(filePath[filePath.length - 1])(dataStr)), result));
					const json = io.readDataSync(filePath.join(path.sep));
					assert(_.isEqual(JSON.stringify(json), result));
					rimraf(filePath.slice(0, 2).join(path.sep), { glob: false }, err => {
						assert.equal(err, null);
						done();
					});
				});
			});
		});
	});

	describe('from tsv to', () => {
		describe('csv', () => {
			it('should convert to format', done => {
				const filePath = ['test', 'tmp-convert-tsv-to-data-csv', 'data.csv'];
				io.convertData(testDataPath('tsv/basic.tsv'), filePath.join(path.sep), { makeDirectories: true }, (err, dataStr) => {
					assert.equal(err, null);
					const result = '[{"name":"jim","occupation":"land surveyor","height":"70"},{"name":"francis","occupation":"conductor","height":"63"}]';
					assert(_.isEqual(JSON.stringify(io.discernParser(filePath[filePath.length - 1])(dataStr)), result));
					const json = io.readDataSync(filePath.join(path.sep));
					assert(_.isEqual(JSON.stringify(json), result));
					rimraf(filePath.slice(0, 2).join(path.sep), { glob: false }, err => {
						assert.equal(err, null);
						done();
					});
				});
			});
		});

		describe('psv', () => {
			it('should convert to format', done => {
				const filePath = ['test', 'tmp-convert-tsv-to-data-psv', 'data.psv'];
				io.convertData(testDataPath('tsv/basic.tsv'), filePath.join(path.sep), { makeDirectories: true }, (err, dataStr) => {
					assert.equal(err, null);
					const result = '[{"name":"jim","occupation":"land surveyor","height":"70"},{"name":"francis","occupation":"conductor","height":"63"}]';
					assert(_.isEqual(JSON.stringify(io.discernParser(filePath[filePath.length - 1])(dataStr)), result));
					const json = io.readDataSync(filePath.join(path.sep));
					assert(_.isEqual(JSON.stringify(json), result));
					rimraf(filePath.slice(0, 2).join(path.sep), { glob: false }, err => {
						assert.equal(err, null);
						done();
					});
				});
			});
		});

		describe('dbf', () => {
			it('should convert to format', done => {
				const filePath = ['test', 'tmp-convert-tsv-to-data-dbf', 'data.dbf'];
				io.convertData(testDataPath('tsv/basic.tsv'), filePath.join(path.sep), { makeDirectories: true }, err => {
					assert.equal(err, null);
					io.readData(filePath.join(path.sep), (err, json) => {
						assert.equal(err, null);
						assert(_.isEqual(JSON.stringify(json), '[{"name":"jim","occupation":"land surveyor","height":"70"},{"name":"francis","occupation":"conductor","height":"63"}]'));
						rimraf(filePath.slice(0, 2).join(path.sep), { glob: false }, err => {
							assert.equal(err, null);
							done();
						});
					});
				});
			});
		});

		describe('json', () => {
			it('should convert to format', done => {
				const filePath = ['test', 'tmp-convert-tsv-to-data-json', 'data.json'];
				io.convertData(testDataPath('tsv/basic.tsv'), filePath.join(path.sep), { makeDirectories: true }, (err, dataStr) => {
					assert.equal(err, null);
					const result = '[{"name":"jim","occupation":"land surveyor","height":"70"},{"name":"francis","occupation":"conductor","height":"63"}]';
					assert(_.isEqual(JSON.stringify(io.discernParser(filePath[filePath.length - 1])(dataStr)), result));
					const json = io.readDataSync(filePath.join(path.sep));
					assert(_.isEqual(JSON.stringify(json), result));
					rimraf(filePath.slice(0, 2).join(path.sep), { glob: false }, err => {
						assert.equal(err, null);
						done();
					});
				});
			});
		});
	});

	describe('from aml to', () => {
		describe('json', () => {
			it('should convert to format', done => {
				const filePath = ['test', 'tmp-convert-aml-to-data-json', 'data.json'];
				io.convertData(testDataPath('aml/basic-2.aml'), filePath.join(path.sep), { makeDirectories: true }, (err, dataStr) => {
					assert.equal(err, null);
					const result = '{"name":"jim","occupation":"land surveyor","height":"70"}';
					assert(_.isEqual(JSON.stringify(io.discernParser(filePath[filePath.length - 1])(dataStr)), result));
					const json = io.readDataSync(filePath.join(path.sep));
					assert(_.isEqual(JSON.stringify(json), result));
					rimraf(filePath.slice(0, 2).join(path.sep), { glob: false }, err => {
						assert.equal(err, null);
						done();
					});
				});
			});
		});
	});
});
