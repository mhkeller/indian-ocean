/* global describe, it */
const chai = require('chai');
const _ = require('underscore');
const dsv = require('d3-dsv');

const io = require('../dist/indian-ocean.cjs.js');
const testDataPath = require('./utils/testDataPath');

const { assertBasicValid } = require('./assertions/index.js');

const assert = chai.assert;

describe('readDataSync()', () => {
	describe('csv with bom characters', () => {
		it('should be read proper keys', () => {
			const file = io.readDataSync(testDataPath('bom/bom.csv'));
			assert.equal(file[0].name, 'jim');
			assert.equal(file[0].occupation, 'land surveyor');
			assert.equal(file[0].height, 70);
			assert.equal(file[1].name, 'francis');
			assert.equal(file[1].occupation, 'conductor');
			assert.equal(file[1].height, 63);
		});
	});

	describe('csv with empty lines', () => {
		describe('no options', () => {
			it('should be read proper keys', () => {
				const file = io.readDataSync(testDataPath('csv-multiline/basic-empty-lines.csv'));
				assert.equal(file.length, 2);

				assert.equal(file[0].name, 'jim');
				assert.equal(file[0].occupation, 'land surveyor');
				assert.equal(file[0].height, 70);
				assert.equal(file[1].name, 'francis');
				assert.equal(file[1].occupation, 'conductor');
				assert.equal(file[1].height, 63);
			});
		});

		describe('trim: true', () => {
			it('should be read proper keys', () => {
				const file = io.readDataSync(testDataPath('csv-multiline/basic-empty-lines.csv'), { trim: true });
				assert.equal(file.length, 2);

				assert.equal(file[0].name, 'jim');
				assert.equal(file[0].occupation, 'land surveyor');
				assert.equal(file[0].height, 70);
				assert.equal(file[1].name, 'francis');
				assert.equal(file[1].occupation, 'conductor');
				assert.equal(file[1].height, 63);
			});
		});

		describe('trim: false', () => {
			it('should be read proper keys', () => {
				const file = io.readDataSync(testDataPath('csv-multiline/basic-empty-lines.csv'), { trim: false });
				assert.equal(file.length, 8);

				assert.equal(file[0].name, 'jim');
				assert.equal(file[0].occupation, 'land surveyor');
				assert.equal(file[0].height, 70);
				assert.equal(file[1].name, 'francis');
				assert.equal(file[1].occupation, 'conductor');
				assert.equal(file[1].height, 63);
			});
		});
	});

	describe('json', () => {
		it('should match expected json', () => {
			const json = io.readDataSync(testDataPath('json/basic.json'));
			assertBasicValid(json);
		});
	});

	describe('json with map', () => {
		it('should match expected json', () => {
			const json = io.readDataSync(testDataPath('json/basic.json'), {
				map(row) {
					row.height *= 2;
					return row;
				}
			});
			assert(_.isEqual(JSON.stringify(json), '[{"name":"jim","occupation":"land surveyor","height":140},{"name":"francis","occupation":"conductor","height":126}]'));
		});
	});

	describe('json with map', () => {
		it('should match expected geojson', () => {
			const json = io.readDataSync(testDataPath('geojson/basic.geojson'), {
				map(row) {
					row.height *= 2;
					return row;
				}
			});
			assert(_.isEqual(JSON.stringify(json), '[{"name":"jim","occupation":"land surveyor","height":140},{"name":"francis","occupation":"conductor","height":126}]'));
		});
	});

	describe('json with map', () => {
		it('should match expected topojson', () => {
			const json = io.readDataSync(testDataPath('topojson/basic.topojson'), {
				map(row) {
					row.height *= 2;
					return row;
				}
			});
			assert(_.isEqual(JSON.stringify(json), '[{"name":"jim","occupation":"land surveyor","height":140},{"name":"francis","occupation":"conductor","height":126}]'));
		});
	});

	describe('json object', () => {
		it('should match expected json', () => {
			const json = io.readDataSync(testDataPath('json-object/basic.json'));
			assert(_.isEqual(JSON.stringify(json), '{"name":"jim","occupation":"land surveyor","height":70}'));
		});
	});

	describe('json object with map', () => {
		it('should match expected json', () => {
			const json = io.readDataSync(testDataPath('json-object/basic.json'), {
				map(value) {
					if (typeof value === 'number') {
						return value * 2;
					}
					return value;
				}
			});
			assert(_.isEqual(JSON.stringify(json), '{"name":"jim","occupation":"land surveyor","height":140}'));
		});
	});

	describe('json object with reviver', () => {
		it('should match expected json', () => {
			const json = io.readDataSync(testDataPath('json-object/basic.json'), {
				reviver(key, value) {
					if (typeof value === 'number') {
						return value * 2;
					}
					return value;
				}
			});
			assert(_.isEqual(JSON.stringify(json), '{"name":"jim","occupation":"land surveyor","height":140}'));
		});
	});

	describe('json with reviver', () => {
		it('should match expected json', () => {
			const json = io.readDataSync(testDataPath('json/basic.json'), {
				reviver(key, value) {
					if (typeof value === 'number') {
						return value * 2;
					}
					return value;
				}
			});
			assert(_.isEqual(JSON.stringify(json), '[{"name":"jim","occupation":"land surveyor","height":140},{"name":"francis","occupation":"conductor","height":126}]'));
		});
	});

	describe('json with map shorthand', () => {
		it('should match expected json', () => {
			const json = io.readDataSync(testDataPath('json/basic.json'), row => {
				row.height *= 2;
				return row;
			});
			assert(_.isEqual(JSON.stringify(json), '[{"name":"jim","occupation":"land surveyor","height":140},{"name":"francis","occupation":"conductor","height":126}]'));
		});
	});

	describe('json object with map shorthand', () => {
		it('should match expected json', () => {
			const json = io.readDataSync(testDataPath('json-object/basic.json'), value => {
				if (typeof value === 'number') {
					return value * 2;
				}
				return value;
			});
			assert(_.isEqual(JSON.stringify(json), '{"name":"jim","occupation":"land surveyor","height":140}'));
		});
	});

	describe('csv', () => {
		it('should match expected json', () => {
			const json = io.readDataSync(testDataPath('csv/basic.csv'));
			assertBasicValid(json, true);
		});
	});

	describe('csv with map', () => {
		it('should match expected json', () => {
			const json = io.readDataSync(testDataPath('csv/basic.csv'), {
				map(row) {
					row.height = +row.height;
					return row;
				}
			});
			assertBasicValid(json);
		});
	});

	describe('csv with map shorthand', () => {
		it('should match expected json', () => {
			const json = io.readDataSync(testDataPath('csv/basic.csv'), row => {
				row.height = +row.height;
				return row;
			});
			assertBasicValid(json);
		});
	});

	describe('psv', () => {
		it('should match expected json', () => {
			const json = io.readDataSync(testDataPath('psv/basic.psv'));
			assertBasicValid(json, true);
		});
	});

	describe('psv with map', () => {
		it('should match expected json', () => {
			const json = io.readDataSync(testDataPath('psv/basic.psv'), {
				map(row) {
					row.height = +row.height;
					return row;
				}
			});
			assertBasicValid(json);
		});
	});

	describe('psv with map shorthand', () => {
		it('should match expected json', () => {
			const json = io.readDataSync(testDataPath('psv/basic.psv'), row => {
				row.height = +row.height;
				return row;
			});
			assertBasicValid(json);
		});
	});

	describe('tsv', () => {
		it('should match expected json', () => {
			const json = io.readDataSync(testDataPath('tsv/basic.tsv'));
			assertBasicValid(json, true);
		});
	});

	describe('tsv with map', () => {
		it('should match expected json', () => {
			const json = io.readDataSync(testDataPath('tsv/basic.tsv'), {
				map(row) {
					row.height = +row.height;
					return row;
				}
			});
			assertBasicValid(json);
		});
	});

	describe('tsv with map shorthand', () => {
		it('should match expected json', () => {
			const json = io.readDataSync(testDataPath('tsv/basic.tsv'), row => {
				row.height = +row.height;
				return row;
			});
			assertBasicValid(json);
		});
	});

	describe('txt', () => {
		it('should match expected txt', () => {
			const txt = io.readDataSync(testDataPath('txt/basic.txt'));
			assert(_.isEqual('The carbon in our apple pies billions upon billions cosmos. Extraplanetary Hypatia. Tendrils of gossamer clouds? Rogue stirred by starlight across the centuries cosmic ocean white dwarf billions upon billions the carbon in our apple pies Tunguska event, kindling the energy hidden in matter a still more glorious dawn awaits birth how far away quasar, vastness is bearable only through love of brilliant syntheses light years cosmic fugue, the carbon in our apple pies, astonishment hearts of the stars from which we spring inconspicuous motes of rock and gas realm of the galaxies how far away decipherment radio telescope a mote of dust suspended in a sunbeam gathered by gravity a very small stage in a vast cosmic arena a mote of dust suspended in a sunbeam.', txt));
		});
	});

	describe('txt with map', () => {
		it('should match expected txt', () => {
			const txt = io.readDataSync(testDataPath('txt/basic.txt'), {
				map(str) {
					return str.replace(/carbon/g, 'diamonds');
				}
			});
			assert(_.isEqual(txt, 'The diamonds in our apple pies billions upon billions cosmos. Extraplanetary Hypatia. Tendrils of gossamer clouds? Rogue stirred by starlight across the centuries cosmic ocean white dwarf billions upon billions the diamonds in our apple pies Tunguska event, kindling the energy hidden in matter a still more glorious dawn awaits birth how far away quasar, vastness is bearable only through love of brilliant syntheses light years cosmic fugue, the diamonds in our apple pies, astonishment hearts of the stars from which we spring inconspicuous motes of rock and gas realm of the galaxies how far away decipherment radio telescope a mote of dust suspended in a sunbeam gathered by gravity a very small stage in a vast cosmic arena a mote of dust suspended in a sunbeam.'));
		});
	});

	describe('txt with map shorthand', () => {
		it('should match expected txt', () => {
			const txt = io.readDataSync(testDataPath('txt/basic.txt'), str => {
				return str.replace(/carbon/g, 'diamonds');
			});
			assert(_.isEqual(txt, 'The diamonds in our apple pies billions upon billions cosmos. Extraplanetary Hypatia. Tendrils of gossamer clouds? Rogue stirred by starlight across the centuries cosmic ocean white dwarf billions upon billions the diamonds in our apple pies Tunguska event, kindling the energy hidden in matter a still more glorious dawn awaits birth how far away quasar, vastness is bearable only through love of brilliant syntheses light years cosmic fugue, the diamonds in our apple pies, astonishment hearts of the stars from which we spring inconspicuous motes of rock and gas realm of the galaxies how far away decipherment radio telescope a mote of dust suspended in a sunbeam gathered by gravity a very small stage in a vast cosmic arena a mote of dust suspended in a sunbeam.'));
		});
	});

	describe('text', () => {
		it('should match expected text', () => {
			const txt = io.readDataSync(testDataPath('text/basic.text'));
			assert(_.isEqual('The carbon in our apple pies billions upon billions cosmos. Extraplanetary Hypatia. Tendrils of gossamer clouds? Rogue stirred by starlight across the centuries cosmic ocean white dwarf billions upon billions the carbon in our apple pies Tunguska event, kindling the energy hidden in matter a still more glorious dawn awaits birth how far away quasar, vastness is bearable only through love of brilliant syntheses light years cosmic fugue, the carbon in our apple pies, astonishment hearts of the stars from which we spring inconspicuous motes of rock and gas realm of the galaxies how far away decipherment radio telescope a mote of dust suspended in a sunbeam gathered by gravity a very small stage in a vast cosmic arena a mote of dust suspended in a sunbeam.', txt));
		});
	});

	describe('text with map', () => {
		it('should match expected text', () => {
			const txt = io.readDataSync(testDataPath('text/basic.text'), {
				map(str) {
					return str.replace(/carbon/g, 'diamonds');
				}
			});
			assert(_.isEqual(txt, 'The diamonds in our apple pies billions upon billions cosmos. Extraplanetary Hypatia. Tendrils of gossamer clouds? Rogue stirred by starlight across the centuries cosmic ocean white dwarf billions upon billions the diamonds in our apple pies Tunguska event, kindling the energy hidden in matter a still more glorious dawn awaits birth how far away quasar, vastness is bearable only through love of brilliant syntheses light years cosmic fugue, the diamonds in our apple pies, astonishment hearts of the stars from which we spring inconspicuous motes of rock and gas realm of the galaxies how far away decipherment radio telescope a mote of dust suspended in a sunbeam gathered by gravity a very small stage in a vast cosmic arena a mote of dust suspended in a sunbeam.'));
		});
	});

	describe('text with map shorthand', () => {
		it('should match expected text', () => {
			const txt = io.readDataSync(testDataPath('text/basic.text'), str => {
				return str.replace(/carbon/g, 'diamonds');
			});
			assert(_.isEqual(txt, 'The diamonds in our apple pies billions upon billions cosmos. Extraplanetary Hypatia. Tendrils of gossamer clouds? Rogue stirred by starlight across the centuries cosmic ocean white dwarf billions upon billions the diamonds in our apple pies Tunguska event, kindling the energy hidden in matter a still more glorious dawn awaits birth how far away quasar, vastness is bearable only through love of brilliant syntheses light years cosmic fugue, the diamonds in our apple pies, astonishment hearts of the stars from which we spring inconspicuous motes of rock and gas realm of the galaxies how far away decipherment radio telescope a mote of dust suspended in a sunbeam gathered by gravity a very small stage in a vast cosmic arena a mote of dust suspended in a sunbeam.'));
		});
	});

	describe('aml', () => {
		it('should match expected json', () => {
			const json = io.readDataSync(testDataPath('aml/basic.aml'));
			assert(_.isEqual(JSON.stringify(json), '{"text":[{"type":"text","value":"I can type words here..."},{"type":"text","value":"And separate them into different paragraphs without tags."}]}'));
		});
	});

	describe('aml with map', () => {
		it('should match expected json', () => {
			const json = io.readDataSync(testDataPath('aml/basic.aml'), {
				map(amlFile) {
					amlFile.text = 'hey';
					return amlFile;
				}
			});
			assert(_.isEqual(JSON.stringify(json), '{"text":"hey"}'));
		});
	});

	describe('aml with map shorthand', () => {
		it('should match expected json', () => {
			const json = io.readDataSync(testDataPath('aml/basic.aml'), amlFile => {
				amlFile.text = 'hey';
				return amlFile;
			});
			assert(_.isEqual(JSON.stringify(json), '{"text":"hey"}'));
		});
	});

	describe('custom delimiter string: `_`', () => {
		it('should match expected json', () => {
			const json = io.readDataSync(testDataPath('other/basic.usv'), { parser: '_' });
			assertBasicValid(json, true);
		});
	});

	describe('custom delimiter obj: `_`', () => {
		it('should match expected json', () => {
			const json = io.readDataSync(testDataPath('other/basic.usv'), { parser: dsv.dsvFormat('_') });
			assertBasicValid(json, true);
		});
	});

	describe('custom delimiter fn with map', () => {
		it('should match expected json', () => {
			const json = io.readDataSync(testDataPath('other/basic.usv'), {
				parser(str, parserOptions) {
					return dsv.dsvFormat('_').parse(str, parserOptions.map);
				},
				map(row) {
					row.height *= 2;
					return row;
				}
			});
			assert(_.isEqual(JSON.stringify(json), '[{"name":"jim","occupation":"land surveyor","height":140},{"name":"francis","occupation":"conductor","height":126}]'));
		});
	});

	describe('custom delimiter parse fn: dsv.dsvFormat(\'_\').parse', () => {
		it('should match expected json', () => {
			const json = io.readDataSync(testDataPath('other/basic.usv'), { parser: dsv.dsvFormat('_').parse });
			assertBasicValid(json, true);
		});
	});

	describe('custom delimiter object: dsv.dsvFormat(\'_\')', () => {
		it('should match expected json', () => {
			const json = io.readDataSync(testDataPath('other/basic.usv'), { parser: dsv.dsvFormat('_') });
			assertBasicValid(json, true);
		});
	});

	describe('custom delimiter fn', () => {
		it('should match expected json', () => {
			const json = io.readDataSync(testDataPath('json/basic.json'), { parser(str) { return JSON.parse(str); } });
			assertBasicValid(json);
		});
	});

	describe('unknown ext', () => {
		it('should match expected text', () => {
			const txt = io.readDataSync(testDataPath('other/fancy-text-extension.text'));
			assert(_.isEqual(txt, 'The carbon in our apple pies billions upon billions cosmos. Extraplanetary Hypatia. Tendrils of gossamer clouds? Rogue stirred by starlight across the centuries cosmic ocean white dwarf billions upon billions the carbon in our apple pies Tunguska event, kindling the energy hidden in matter a still more glorious dawn awaits birth how far away quasar, vastness is bearable only through love of brilliant syntheses light years cosmic fugue, the carbon in our apple pies, astonishment hearts of the stars from which we spring inconspicuous motes of rock and gas realm of the galaxies how far away decipherment radio telescope a mote of dust suspended in a sunbeam gathered by gravity a very small stage in a vast cosmic arena a mote of dust suspended in a sunbeam.'));
		});
	});
});
