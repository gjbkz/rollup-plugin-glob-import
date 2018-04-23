const path = require('path');
module.exports = [
	{
		format: 'default',
		rename(name, file) {
			return name || path.basename(file).replace(/\W/g, '_');
		},
	},
];
