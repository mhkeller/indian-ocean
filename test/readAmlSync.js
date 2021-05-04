/* global describe, it */
const chai = require('chai');
const _ = require('underscore');

const io = require('../dist/indian-ocean.cjs.js');
const testDataPath = require('./utils/testDataPath');

const assert = chai.assert;

describe('readAmlSync()', () => {
	describe('empty', () => {
		it('should be empty object', () => {
			const json = io.readAmlSync(testDataPath('aml/empty.aml'));
			assert(_.isEmpty(json));
			assert(_.isObject(json));
		});
	});

	describe('basic', () => {
		it('should match expected json', () => {
			const json = io.readAmlSync(testDataPath('aml/basic.aml'));
			assert(_.isEqual(JSON.stringify(json), '{"text":[{"type":"text","value":"I can type words here..."},{"type":"text","value":"And separate them into different paragraphs without tags."}]}'));
		});
	});

	describe('basic map', () => {
		it('should match expected json', () => {
			const json = io.readAmlSync(testDataPath('aml/basic.aml'), {
				map(amlFile) {
					amlFile.text = 'hey';
					return amlFile;
				}
			});
			assert(_.isEqual(JSON.stringify(json), '{"text":"hey"}'));
		});
	});

	describe('basic map shorthand', () => {
		it('should match expected json', () => {
			const json = io.readAmlSync(testDataPath('aml/basic.aml'), amlFile => {
				amlFile.text = 'hey';
				return amlFile;
			});
			assert(_.isEqual(JSON.stringify(json), '{"text":"hey"}'));
		});
	});
});
