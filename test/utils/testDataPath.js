const path = require('path');

module.exports = function testDataPath(name) {
	return path.join(path.resolve('./'), 'test', 'data', name);
};
