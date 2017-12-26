const path = require('path');
const {createFilter} = require('rollup-pluginutils');
const glob = require('glob');

module.exports = function globImport({include, exclude} = {}) {
	const filter = createFilter(include, exclude);
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
			.then((files) => {
				const tempPath = path.join(importerDirectory, importee.replace(/\W/g, (c) => `_${c.codePointAt(0)}_`));
				const code = files.map((file) => `export * from ${JSON.stringify(file)};`).join('\n');
				generatedCodes.set(tempPath, code);
				return tempPath;
			});
		},
		load(id) {
			if (generatedCodes.has(id)) {
				const code = generatedCodes.get(id);
				generatedCodes.delete(id);
				return code;
			}
			return null;
		},
	};
};
