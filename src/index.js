const path = require('path');
const glob = require('glob');
const createFilter = require('rollup-pluginutils').createFilter;
const toURLString = require('./toURLString');
const pseudoFileName = require('./pseudoFileName');

function globImport({include, exclude} = {}) {
	const filter = createFilter(include, exclude);
	const generatedCodes = new Map();
	return {
		name: 'glob-import',
		resolveId(importee, importer) {
			if (!filter(importee) || !importee.includes('*')) {
				return null;
			}
			const importeeIsAbsolute = path.isAbsolute(importee);
			const importerDirectory = path.dirname(importer);
			return new Promise((resolve, reject) => {
				glob(
					importeeIsAbsolute
					? importee
					: path.join(importerDirectory, importee),
					(error, files) => {
						if (error) {
							reject(error);
						} else {
							resolve(files);
						}
					}
				);
			})
			.then((foundFiles) => {
				const code = foundFiles
				.map(
					importeeIsAbsolute
					? (file) => {
						return `import '${toURLString(file)}';`;
					}
					: (file) => {
						return `import '${toURLString(path.relative(importerDirectory, file))}';`;
					}
				)
				.join('\n');
				const pseudoPath = path.join(importerDirectory, pseudoFileName(importee));
				generatedCodes.set(pseudoPath, code);
				return pseudoPath;
			});
		},
		load(id) {
			if (generatedCodes.has(id)) {
				const code = generatedCodes.get(id);
				generatedCodes.delete(id);
				return code;
			}
		}
	};
}

module.exports = globImport;
