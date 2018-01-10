const path = require('path');
const {createFilter} = require('rollup-pluginutils');
const glob = require('glob');
const codeGenerator = require('./code-generator');

module.exports = function globImport(options = {}) {
	options = Object.assign(
		{
			format: 'mixed',
			defaultExport(file) {
				return path.basename(file, path.extname(file))
				.replace(/[-+*/:;.'"`?!&~|<>^%#=@[\]{}()\s\\]+([a-z]|$)/g, (match, c) => c.toUpperCase());
			},
		},
		options
	);
	const generateCode = codeGenerator[options.format];
	if (!generateCode) {
		throw new Error(`Invalid format: ${options.format}`);
	}
	const filter = createFilter(options.include, options.exclude);
	const generatedCodes = new Map();
	return {
		name: 'glob-import',
		resolveId(importee, importer) {
			if (!filter(importee) || !importee.includes('*')) {
				return null;
			}
			const importerDirectory = path.dirname(importer);
			return new Promise((resolve, reject) => {
				glob(importee, {cwd: importerDirectory}, (error, files) => {
					if (error) {
						reject(error);
					} else {
						resolve(files);
					}
				});
			})
			.then((files) => generateCode(files, importer, options))
			.then((code) => {
				const tempPath = path.join(importerDirectory, importee.replace(/\W/g, (c) => `_${c.codePointAt(0)}_`));
				generatedCodes.set(tempPath, code);
				return tempPath;
			});
		},
		load(id) {
			return generatedCodes.get(id);
		},
	};
};
