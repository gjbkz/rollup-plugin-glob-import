const path = require('path');
module.exports = [
	{
		format: 'default',
		defaultExport(file) {
			return path.basename(file).replace(/\W/g, '_');
		},
	},
];
