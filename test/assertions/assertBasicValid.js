const _ = require('underscore');
const chai = require('chai');

const assert = chai.assert;

module.exports = function assertBasicValid(json, strings, columns) {
	const values = strings ? ['70', '63'] : [70, 63];

	columns = columns || ['name', 'occupation', 'height'];

	assert.lengthOf(json, 2);
	assert.typeOf(json[0], 'object');
	assert(_.isEqual(_.keys(json[0]), columns), 'headers match keys');
	assert(_.isEqual(_.keys(json[1]), columns), 'headers match keys');
	assert(_.isEqual(_.values(json[0]), ['jim', 'land surveyor', values[0]]), 'data values match values');
	assert(_.isEqual(_.values(json[1]), ['francis', 'conductor', values[1]]), 'data values match values');
};
