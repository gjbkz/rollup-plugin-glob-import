const path = require('path');
const globImport = require('../..');
module.exports = {
	input: 'input.js',
	plugins: [globImport({
		rename(name, id) {
			return name || path.relative(__dirname, id).replace(/[^\w]/g, '_');
		},
	})],
	output: {
		file: 'output.js',
		format: 'es',
	},
};
