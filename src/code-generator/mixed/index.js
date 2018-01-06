const path = require('path');
const fs = require('fs');
const acorn = require('acorn');

module.exports = function generate(files, importer, options) {
	return Promise.all(files.map((file) => {
		return new Promise((resolve, reject) => {
			fs.readFile(path.join(path.dirname(importer), file), 'utf8', (error, code) => {
				if (error) {
					reject(error);
				} else {
					resolve(code);
				}
			});
		})
		.then((code) => {
			const tokenizer = acorn.tokenizer(code);
			for (const token of tokenizer) {
				if (token.type.label === 'export' && tokenizer.getToken().type.label === 'default') {
					return file;
				}
			}
			return false;
		});
	}))
	.then((defaultExportModules) => {
		return [
			...defaultExportModules
			.filter((x) => Boolean(x))
			.map((file, index) => [
				`import _${index} from ${JSON.stringify(file)};`,
				`export {_${index} as ${options.defaultExport(file)}};`,
				`export * from ${JSON.stringify(file)};`,
			].join('\n')),
			...files.map((file) => `export * from ${JSON.stringify(file)};`),
		].join('\n');
	});
};
