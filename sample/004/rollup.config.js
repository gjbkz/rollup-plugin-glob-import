const globImport = require('../..');
module.exports = {
	input: 'input.js',
	plugins: [globImport({
		defaultExport(absoluteFilePath) {
			return absoluteFilePath.replace(/[^\w]/g, '_');
		},
	})],
	output: {
		file: 'output.js',
		format: 'es',
	},
};
