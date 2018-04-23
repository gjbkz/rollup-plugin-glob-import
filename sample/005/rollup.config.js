const globImport = require('../..');
module.exports = {
	input: 'input.js',
	plugins: [globImport({
		rename(name, id) {
			return `${id}/${name}`.replace(/[^\w]/g, '_');
		},
	})],
	output: {
		file: 'output.js',
		format: 'es',
	},
};
