const path = require('path');
const {createFilter} = require('rollup-pluginutils');
const glob = require('glob');
const toURLString = require('./toURLString');

function getPseudoFileName(importee) {
	return `${
		importee
		.replace(/\*/g, '-star-')
		.replace(/[^\w-]/g, '_')
	}.js`;
}

function globImport({include, exclude} = {}) {
	const filter = createFilter(include, exclude);
	const generatedCodes = new Map();
	return {
		name: 'glob-import',
		async resolveId(importee, importer) {
			if (!filter(importee) || !importee.includes('*')) {
				return null;
			}
			const importeeIsAbsolute = path.isAbsolute(importee);
			const importerDirectory = path.dirname(importer);
			const foundFiles = await new Promise((resolve, reject) => {
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
			});
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
			const pseudoPath = path.join(importerDirectory, getPseudoFileName(importee));
			generatedCodes.set(pseudoPath, code);
			return pseudoPath;
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
