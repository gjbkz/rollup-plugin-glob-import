const defaultFormat = require('./default');
const namedFormat = require('./named');
const mixedFormat = require('./mixed');
const importFormat = require('./import');
module.exports = {
	default: defaultFormat,
	named: namedFormat,
	mixed: mixedFormat,
	import: importFormat,
};
