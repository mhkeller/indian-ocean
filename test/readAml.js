/* global describe, it */
const chai = require('chai');
const _ = require('underscore');

const io = require('../dist/indian-ocean.cjs.js');
const testDataPath = require('./utils/testDataPath');

const assert = chai.assert;

describe('readAml()', () => {
	describe('empty', () => {
		it('should be empty object', done => {
			io.readAml(testDataPath('aml/empty.aml'), (err, json) => {
				assert.equal(err, null);
				assert(_.isEmpty(json));
				assert(_.isObject(json));
				done();
			});
		});
	});

	describe('basic', () => {
		it('should match expected json', done => {
			io.readAml(testDataPath('aml/basic.aml'), (err, json) => {
				assert.equal(err, null);
				assert(_.isEqual(JSON.stringify(json), '{"text":[{"type":"text","value":"I can type words here..."},{"type":"text","value":"And separate them into different paragraphs without tags."}]}'));
				done();
			});
		});
	});

	describe('basic map', () => {
		it('should match expected json', done => {
			io.readAml(testDataPath('aml/basic.aml'), {
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

	describe('basic map shorthand', () => {
		it('should match expected json', done => {
			io.readAml(testDataPath('aml/basic.aml'), amlFile => {
				amlFile.text = 'hey';
				return amlFile;
			}, (err, json) => {
				assert.equal(err, null);
				assert(_.isEqual(JSON.stringify(json), '{"text":"hey"}'));
				done();
			});
		});
	});
});
