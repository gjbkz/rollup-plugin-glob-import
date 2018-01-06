const defaultExports = require('./default');
const namedExports = require('./named');
const mixedExports = require('./mixed');
module.exports = {
	default: defaultExports,
	named: namedExports,
	mixed: mixedExports,
};
