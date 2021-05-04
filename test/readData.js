/* global describe, it */
const chai = require('chai');
const _ = require('underscore');
const dsv = require('d3-dsv');

const io = require('../dist/indian-ocean.cjs.js');
const testDataPath = require('./utils/testDataPath');

const { assertBasicValid } = require('./assertions/index.js');

const assert = chai.assert;

describe('readData()', () => {
	describe('csv with bom characters', () => {
		it('should be read proper keys', done => {
			io.readData(testDataPath('bom/bom.csv'), (err, file) => {
				assert.equal(file[0].name, 'jim');
				assert.equal(file[0].occupation, 'land surveyor');
				assert.equal(file[0].height, 70);
				assert.equal(file[1].name, 'francis');
				assert.equal(file[1].occupation, 'conductor');
				assert.equal(file[1].height, 63);
				done();
			});
		});
	});

	describe('csv with empty lines', () => {
		it('should be read proper keys', done => {
			io.readData(testDataPath('csv-multiline/basic-empty-lines.csv'), (err, file) => {
				assert.equal(file.length, 2);

				assert.equal(file[0].name, 'jim');
				assert.equal(file[0].occupation, 'land surveyor');
				assert.equal(file[0].height, 70);
				assert.equal(file[1].name, 'francis');
				assert.equal(file[1].occupation, 'conductor');
				assert.equal(file[1].height, 63);
				done();
			});
		});
	});

	describe('json', () => {
		it('should match expected json', done => {
			io.readData(testDataPath('json/basic.json'), (err, json) => {
				assert.equal(err, null);
				assertBasicValid(json);
				done();
			});
		});

		it('should match expected geojson', done => {
			io.readData(testDataPath('geojson/basic.geojson'), (err, json) => {
				assert.equal(err, null);
				assertBasicValid(json);
				done();
			});
		});

		it('should match expected topojson', done => {
			io.readData(testDataPath('topojson/basic.topojson'), (err, json) => {
				assert.equal(err, null);
				assertBasicValid(json);
				done();
			});
		});

		it('should match expected json', done => {
			io.readData(testDataPath('json/basic.json'), {
				map(row) {
					row.height *= 2;
					return row;
				}
			}, (err, json) => {
				assert.equal(err, null);
				assert(_.isEqual(JSON.stringify(json), '[{"name":"jim","occupation":"land surveyor","height":140},{"name":"francis","occupation":"conductor","height":126}]'));
				done();
			});
		});
	});

	describe('json object', () => {
		it('should match expected json', done => {
			io.readData(testDataPath('json-object/basic.json'), (err, json) => {
				assert.equal(err, null);
				assert(_.isEqual(JSON.stringify(json), '{"name":"jim","occupation":"land surveyor","height":70}'));
				done();
			});
		});
	});

	describe('json object with map', () => {
		it('should match expected json', done => {
			io.readData(testDataPath('json-object/basic.json'), {
				map(value) {
					if (typeof value === 'number') {
						return value * 2;
					}
					return value;
				}
			}, (err, json) => {
				assert.equal(err, null);
				assert(_.isEqual(JSON.stringify(json), '{"name":"jim","occupation":"land surveyor","height":140}'));
				done();
			});
		});
	});

	describe('json object with reviver', () => {
		it('should match expected json', done => {
			io.readData(testDataPath('json-object/basic.json'), {
				reviver(key, value) {
					if (typeof value === 'number') {
						return value * 2;
					}
					return value;
				}
			}, (err, json) => {
				assert.equal(err, null);
				assert(_.isEqual(JSON.stringify(json), '{"name":"jim","occupation":"land surveyor","height":140}'));
				done();
			});
		});
	});

	describe('json with reviver', () => {
		it('should match expected json', done => {
			io.readData(testDataPath('json/basic.json'), {
				reviver(key, value) {
					if (typeof value === 'number') {
						return value * 2;
					}
					return value;
				}
			}, (err, json) => {
				assert.equal(err, null);
				assert(_.isEqual(JSON.stringify(json), '[{"name":"jim","occupation":"land surveyor","height":140},{"name":"francis","occupation":"conductor","height":126}]'));
				done();
			});
		});
	});

	describe('json with map shorthand', () => {
		it('should match expected json', done => {
			io.readData(testDataPath('json/basic.json'), row => {
				row.height *= 2;
				return row;
			}, (err, json) => {
				assert.equal(err, null);
				assert(_.isEqual(JSON.stringify(json), '[{"name":"jim","occupation":"land surveyor","height":140},{"name":"francis","occupation":"conductor","height":126}]'));
				done();
			});
		});
	});

	describe('json object with map shorthand', () => {
		it('should match expected json', done => {
			io.readData(testDataPath('json-object/basic.json'), value => {
				if (typeof value === 'number') {
					return value * 2;
				}
				return value;
			}, (err, json) => {
				assert.equal(err, null);
				assert(_.isEqual(JSON.stringify(json), '{"name":"jim","occupation":"land surveyor","height":140}'));
				done();
			});
		});
	});

	describe('csv', () => {
		it('should match expected json', done => {
			io.readData(testDataPath('csv/basic.csv'), (err, json) => {
				assert.equal(err, null);
				assertBasicValid(json, true);
				done();
			});
		});
	});

	describe('csv with map', () => {
		it('should match expected json', done => {
			io.readData(testDataPath('csv/basic.csv'), {
				map(row) {
					row.height = +row.height;
					return row;
				}
			}, (err, json) => {
				assert.equal(err, null);
				assertBasicValid(json);
				done();
			});
		});
	});

	describe('csv with map shorthand', () => {
		it('should match expected json', done => {
			io.readData(testDataPath('csv/basic.csv'), row => {
				row.height = +row.height;
				return row;
			}, (err, json) => {
				assert.equal(err, null);
				assertBasicValid(json);
				done();
			});
		});
	});

	describe('psv', () => {
		it('should match expected json', done => {
			io.readData(testDataPath('psv/basic.psv'), (err, json) => {
				assert.equal(err, null);
				assertBasicValid(json, true);
				done();
			});
		});
	});

	describe('psv with map', () => {
		it('should match expected json', done => {
			io.readData(testDataPath('psv/basic.psv'), {
				map(row) {
					row.height = +row.height;
					return row;
				}
			}, (err, json) => {
				assert.equal(err, null);
				assertBasicValid(json);
				done();
			});
		});
	});

	describe('psv with map shorthand', () => {
		it('should match expected json', done => {
			io.readData(testDataPath('psv/basic.psv'), row => {
				row.height = +row.height;
				return row;
			}, (err, json) => {
				assert.equal(err, null);
				assertBasicValid(json);
				done();
			});
		});
	});

	describe('tsv', () => {
		it('should match expected json', done => {
			io.readData(testDataPath('tsv/basic.tsv'), (err, json) => {
				assert.equal(err, null);
				assertBasicValid(json, true);
				done();
			});
		});
	});

	describe('tsv with map', () => {
		it('should match expected json', done => {
			io.readData(testDataPath('tsv/basic.tsv'), {
				map(row) {
					row.height = +row.height;
					return row;
				}
			}, (err, json) => {
				assert.equal(err, null);
				assertBasicValid(json);
				done();
			});
		});
	});

	describe('tsv with map shorthand', () => {
		it('should match expected json', done => {
			io.readData(testDataPath('tsv/basic.tsv'), row => {
				row.height = +row.height;
				return row;
			}, (err, json) => {
				assert.equal(err, null);
				assertBasicValid(json);
				done();
			});
		});
	});

	describe('txt', () => {
		it('should match expected txt', done => {
			io.readData(testDataPath('txt/basic.txt'), (err, txt) => {
				assert.equal(err, null);
				assert(_.isEqual(txt, 'The carbon in our apple pies billions upon billions cosmos. Extraplanetary Hypatia. Tendrils of gossamer clouds? Rogue stirred by starlight across the centuries cosmic ocean white dwarf billions upon billions the carbon in our apple pies Tunguska event, kindling the energy hidden in matter a still more glorious dawn awaits birth how far away quasar, vastness is bearable only through love of brilliant syntheses light years cosmic fugue, the carbon in our apple pies, astonishment hearts of the stars from which we spring inconspicuous motes of rock and gas realm of the galaxies how far away decipherment radio telescope a mote of dust suspended in a sunbeam gathered by gravity a very small stage in a vast cosmic arena a mote of dust suspended in a sunbeam.'));
				done();
			});
		});
	});

	describe('txt with map', () => {
		it('should match expected txt', done => {
			io.readData(testDataPath('txt/basic.txt'), {
				map(str) {
					return str.replace(/carbon/g, 'diamonds');
				}
			}, (err, txt) => {
				assert.equal(err, null);
				assert(_.isEqual(txt, 'The diamonds in our apple pies billions upon billions cosmos. Extraplanetary Hypatia. Tendrils of gossamer clouds? Rogue stirred by starlight across the centuries cosmic ocean white dwarf billions upon billions the diamonds in our apple pies Tunguska event, kindling the energy hidden in matter a still more glorious dawn awaits birth how far away quasar, vastness is bearable only through love of brilliant syntheses light years cosmic fugue, the diamonds in our apple pies, astonishment hearts of the stars from which we spring inconspicuous motes of rock and gas realm of the galaxies how far away decipherment radio telescope a mote of dust suspended in a sunbeam gathered by gravity a very small stage in a vast cosmic arena a mote of dust suspended in a sunbeam.'));
				done();
			});
		});
	});

	describe('txt with map shorthand', () => {
		it('should match expected txt', done => {
			io.readData(testDataPath('txt/basic.txt'), str => {
				return str.replace(/carbon/g, 'diamonds');
			}, (err, txt) => {
				assert.equal(err, null);
				assert(_.isEqual(txt, 'The diamonds in our apple pies billions upon billions cosmos. Extraplanetary Hypatia. Tendrils of gossamer clouds? Rogue stirred by starlight across the centuries cosmic ocean white dwarf billions upon billions the diamonds in our apple pies Tunguska event, kindling the energy hidden in matter a still more glorious dawn awaits birth how far away quasar, vastness is bearable only through love of brilliant syntheses light years cosmic fugue, the diamonds in our apple pies, astonishment hearts of the stars from which we spring inconspicuous motes of rock and gas realm of the galaxies how far away decipherment radio telescope a mote of dust suspended in a sunbeam gathered by gravity a very small stage in a vast cosmic arena a mote of dust suspended in a sunbeam.'));
				done();
			});
		});
	});

	describe('text', () => {
		it('should match expected text', done => {
			io.readData(testDataPath('text/basic.text'), (err, txt) => {
				assert.equal(err, null);
				assert(_.isEqual(txt, 'The carbon in our apple pies billions upon billions cosmos. Extraplanetary Hypatia. Tendrils of gossamer clouds? Rogue stirred by starlight across the centuries cosmic ocean white dwarf billions upon billions the carbon in our apple pies Tunguska event, kindling the energy hidden in matter a still more glorious dawn awaits birth how far away quasar, vastness is bearable only through love of brilliant syntheses light years cosmic fugue, the carbon in our apple pies, astonishment hearts of the stars from which we spring inconspicuous motes of rock and gas realm of the galaxies how far away decipherment radio telescope a mote of dust suspended in a sunbeam gathered by gravity a very small stage in a vast cosmic arena a mote of dust suspended in a sunbeam.'));
				done();
			});
		});
	});

	describe('text with map', () => {
		it('should match expected text', done => {
			io.readData(testDataPath('text/basic.text'), {
				map(str) {
					return str.replace(/carbon/g, 'diamonds');
				}
			}, (err, text) => {
				assert.equal(err, null);
				assert(_.isEqual(text, 'The diamonds in our apple pies billions upon billions cosmos. Extraplanetary Hypatia. Tendrils of gossamer clouds? Rogue stirred by starlight across the centuries cosmic ocean white dwarf billions upon billions the diamonds in our apple pies Tunguska event, kindling the energy hidden in matter a still more glorious dawn awaits birth how far away quasar, vastness is bearable only through love of brilliant syntheses light years cosmic fugue, the diamonds in our apple pies, astonishment hearts of the stars from which we spring inconspicuous motes of rock and gas realm of the galaxies how far away decipherment radio telescope a mote of dust suspended in a sunbeam gathered by gravity a very small stage in a vast cosmic arena a mote of dust suspended in a sunbeam.'));
				done();
			});
		});
	});

	describe('text with map shorthand', () => {
		it('should match expected text', done => {
			io.readData(testDataPath('text/basic.text'), str => {
				return str.replace(/carbon/g, 'diamonds');
			}, (err, text) => {
				assert.equal(err, null);
				assert(_.isEqual(text, 'The diamonds in our apple pies billions upon billions cosmos. Extraplanetary Hypatia. Tendrils of gossamer clouds? Rogue stirred by starlight across the centuries cosmic ocean white dwarf billions upon billions the diamonds in our apple pies Tunguska event, kindling the energy hidden in matter a still more glorious dawn awaits birth how far away quasar, vastness is bearable only through love of brilliant syntheses light years cosmic fugue, the diamonds in our apple pies, astonishment hearts of the stars from which we spring inconspicuous motes of rock and gas realm of the galaxies how far away decipherment radio telescope a mote of dust suspended in a sunbeam gathered by gravity a very small stage in a vast cosmic arena a mote of dust suspended in a sunbeam.'));
				done();
			});
		});
	});

	describe('aml', () => {
		it('should match expected json', done => {
			io.readData(testDataPath('aml/basic.aml'), (err, json) => {
				assert.equal(err, null);
				assert(_.isEqual(JSON.stringify(json), '{"text":[{"type":"text","value":"I can type words here..."},{"type":"text","value":"And separate them into different paragraphs without tags."}]}'));
				done();
			});
		});
	});

	describe('aml with map', () => {
		it('should match expected json', done => {
			io.readData(testDataPath('aml/basic.aml'), {
				map(amlFile) {
					amlFile.text = 'hey';
					return amlFile;
				}
			}, (err, json) => {
				assert.equal(err, null);
				assert(_.isEqual(JSON.stringify(json), '{"text":"hey"}'));
				done();
			});
		});
	});

	describe('aml with map shorthand', () => {
		it('should match expected json', done => {
			io.readData(testDataPath('aml/basic.aml'), amlFile => {
				amlFile.text = 'hey';
				return amlFile;
			}, (err, json) => {
				assert.equal(err, null);
				assert(_.isEqual(JSON.stringify(json), '{"text":"hey"}'));
				done();
			});
		});
	});

	describe('dbf', () => {
		describe('empty', () => {
			it('should be empty array', done => {
				io.readData(testDataPath('dbf/empty.dbf'), err => {
					assert.equal(err.split('\n')[0], 'TypeError: Cannot read property \'buffer\' of null');
					done();
				});
			});
		});

		describe('basic', () => {
			it('should match expected json', done => {
				io.readDbf(testDataPath('dbf/basic.dbf'), (err, json) => {
					assert.equal(err, null);
					assert(_.isEqual(JSON.stringify(json), '[{"foo":"orange","bar":0},{"foo":"blue","bar":1},{"foo":"green","bar":2}]'));
					done();
				});
			});
		});

		describe('basic map', () => {
			it('should match expected json', done => {
				io.readData(testDataPath('dbf/basic.dbf'), {
					map(row) {
						row.bar *= 2;
						return row;
					}
				}, (err, json) => {
					assert.equal(err, null);
					assert(_.isEqual(JSON.stringify(json), '[{"foo":"orange","bar":0},{"foo":"blue","bar":2},{"foo":"green","bar":4}]'));
					done();
				});
			});
		});

		describe('basic map shorthand', () => {
			it('should match expected json', done => {
				io.readData(testDataPath('dbf/basic.dbf'), row => {
					row.bar *= 2;
					return row;
				}, (err, json) => {
					assert.equal(err, null);
					assert(_.isEqual(JSON.stringify(json), '[{"foo":"orange","bar":0},{"foo":"blue","bar":2},{"foo":"green","bar":4}]'));
					done();
				});
			});
		});
	});

	describe('custom delimiter string: `_`', () => {
		it('should match expected json', done => {
			io.readData(testDataPath('other/basic.usv'), { parser: '_' }, (err, json) => {
				assert.equal(err, null);
				assertBasicValid(json, true);
				done();
			});
		});
	});

	describe('custom delimiter fn with map', () => {
		it('should match expected json', done => {
			io.readData(testDataPath('other/basic.usv'), {
				parser(str, parserOptions) {
					return dsv.dsvFormat('_').parse(str, parserOptions.map);
				},
				map(row) {
					row.height *= 2;
					return row;
				}
			}, (err, json) => {
				assert.equal(err, null);
				assert(_.isEqual(JSON.stringify(json), '[{"name":"jim","occupation":"land surveyor","height":140},{"name":"francis","occupation":"conductor","height":126}]'));
				done();
			});
		});
	});

	describe('custom delimiter parse fn: dsv.dsvFormat(\'_\').parse', () => {
		it('should match expected json', done => {
			io.readData(testDataPath('other/basic.usv'), { parser: dsv.dsvFormat('_').parse }, (err, json) => {
				assert.equal(err, null);
				assertBasicValid(json, true);
				done();
			});
		});
	});

	describe('custom delimiter object: dsv.dsvFormat(\'_\')', () => {
		it('should match expected json', done => {
			io.readData(testDataPath('other/basic.usv'), { parser: dsv.dsvFormat('_') }, (err, json) => {
				assert.equal(err, null);
				assertBasicValid(json, true);
				done();
			});
		});
	});

	describe('custom delimiter fn', () => {
		it('should match expected json', done => {
			io.readData(testDataPath('json/basic.json'), { parser(str) { return JSON.parse(str); } }, (err, json) => {
				assert.equal(err, null);
				assertBasicValid(json);
				done();
			});
		});
	});

	describe('unknown ext', () => {
		it('should match expected text', done => {
			io.readData(testDataPath('other/fancy-text-extension.text'), (err, txt) => {
				assert.equal(err, null);
				assert(_.isEqual(txt, 'The carbon in our apple pies billions upon billions cosmos. Extraplanetary Hypatia. Tendrils of gossamer clouds? Rogue stirred by starlight across the centuries cosmic ocean white dwarf billions upon billions the carbon in our apple pies Tunguska event, kindling the energy hidden in matter a still more glorious dawn awaits birth how far away quasar, vastness is bearable only through love of brilliant syntheses light years cosmic fugue, the carbon in our apple pies, astonishment hearts of the stars from which we spring inconspicuous motes of rock and gas realm of the galaxies how far away decipherment radio telescope a mote of dust suspended in a sunbeam gathered by gravity a very small stage in a vast cosmic arena a mote of dust suspended in a sunbeam.'));
				done();
			});
		});
	});
});
