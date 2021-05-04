const chai = require('chai');
const _ = require('underscore');

const assert = chai.assert;

module.exports = function assertBasicValidObject(obj, strings, row) {
	const values = strings ? ['70', '63'] : [70, 63];
	assert.typeOf(obj, 'object');
	assert(_.isEqual(_.keys(obj), ['name', 'occupation', 'height']), 'headers match keys');
	if (row === undefined || row === 0) {
		assert(_.isEqual(_.values(obj), ['jim', 'land surveyor', values[0]]), 'data values match values');
	} else if (row === 1) {
		assert(_.isEqual(_.values(obj), ['francis', 'conductor', values[1]]), 'data values match values');
	}
};
