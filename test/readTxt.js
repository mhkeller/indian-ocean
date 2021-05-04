/* global describe, it */
const chai = require('chai');
const _ = require('underscore');

const io = require('../dist/indian-ocean.cjs.js');
const testDataPath = require('./utils/testDataPath');

const assert = chai.assert;

describe('readTxt()', () => {
	describe('empty', () => {
		it('should be empty', done => {
			io.readTxt(testDataPath('txt/empty.txt'), (err, json) => {
				assert.equal(err, null);
				assert.lengthOf(json, 0);
				done();
			});
		});
	});

	describe('basic', () => {
		it('should match expected txt', done => {
			io.readTxt(testDataPath('txt/basic.txt'), (err, txt) => {
				assert.equal(err, null);
				assert(_.isEqual(txt, 'The carbon in our apple pies billions upon billions cosmos. Extraplanetary Hypatia. Tendrils of gossamer clouds? Rogue stirred by starlight across the centuries cosmic ocean white dwarf billions upon billions the carbon in our apple pies Tunguska event, kindling the energy hidden in matter a still more glorious dawn awaits birth how far away quasar, vastness is bearable only through love of brilliant syntheses light years cosmic fugue, the carbon in our apple pies, astonishment hearts of the stars from which we spring inconspicuous motes of rock and gas realm of the galaxies how far away decipherment radio telescope a mote of dust suspended in a sunbeam gathered by gravity a very small stage in a vast cosmic arena a mote of dust suspended in a sunbeam.'));
				done();
			});
		});
	});

	describe('basic replaced', () => {
		it('should match expected txt', done => {
			io.readTxt(testDataPath('txt/basic.txt'), {
				map(str) {
					return str.replace(/carbon/g, 'diamonds');
				}
			},
			(err, txt) => {
				assert.equal(err, null);
				assert(_.isEqual(txt, 'The diamonds in our apple pies billions upon billions cosmos. Extraplanetary Hypatia. Tendrils of gossamer clouds? Rogue stirred by starlight across the centuries cosmic ocean white dwarf billions upon billions the diamonds in our apple pies Tunguska event, kindling the energy hidden in matter a still more glorious dawn awaits birth how far away quasar, vastness is bearable only through love of brilliant syntheses light years cosmic fugue, the diamonds in our apple pies, astonishment hearts of the stars from which we spring inconspicuous motes of rock and gas realm of the galaxies how far away decipherment radio telescope a mote of dust suspended in a sunbeam gathered by gravity a very small stage in a vast cosmic arena a mote of dust suspended in a sunbeam.'));
				done();
			});
		});
	});

	describe('basic replaced shorthand', () => {
		it('should match expected txt', done => {
			io.readTxt(testDataPath('txt/basic.txt'), str => {
				return str.replace(/carbon/g, 'diamonds');
			},
			(err, txt) => {
				assert.equal(err, null);
				assert(_.isEqual(txt, 'The diamonds in our apple pies billions upon billions cosmos. Extraplanetary Hypatia. Tendrils of gossamer clouds? Rogue stirred by starlight across the centuries cosmic ocean white dwarf billions upon billions the diamonds in our apple pies Tunguska event, kindling the energy hidden in matter a still more glorious dawn awaits birth how far away quasar, vastness is bearable only through love of brilliant syntheses light years cosmic fugue, the diamonds in our apple pies, astonishment hearts of the stars from which we spring inconspicuous motes of rock and gas realm of the galaxies how far away decipherment radio telescope a mote of dust suspended in a sunbeam gathered by gravity a very small stage in a vast cosmic arena a mote of dust suspended in a sunbeam.'));
				done();
			});
		});
	});
});
