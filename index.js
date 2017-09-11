const path = require('path');
const {promisify} = require('util');
const {createFilter} = require('rollup-pluginutils');
const glob = promisify(require('glob'));

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
			const foundFiles = await glob(
				importeeIsAbsolute
				? importee
				: path.join(importerDirectory, importee)
			);
			const code = foundFiles
			.map(
				importeeIsAbsolute
				? (file) => {
					return `import '${file}';`;
				}
				: (file) => {
					return `import './${path.relative(importerDirectory, file)}';`;
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
