const globImport = require('../..');
module.exports = {
	input: 'input.js',
	plugins: [globImport()],
	output: {
		file: 'output.js',
		format: 'es',
	},
};
