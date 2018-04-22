const path = require('path');
const fs = require('fs');
module.exports = fs.readdirSync(__dirname)
.filter((filename) => filename.match(/^\d+$/))
.map((projectName) => {
	const projectRoot = path.join(__dirname, projectName);
	const config = require(`./${projectName}/rollup.config.js`);
	config.input = path.join(projectRoot, config.input);
	config.output.file = path.join(projectRoot, config.output.file);
	return config;
});
