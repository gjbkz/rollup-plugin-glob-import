const path = require('path');
const fs = require('fs');
const acorn = require('acorn');

module.exports = function generate(files, importer, options) {
	const acornOptions = Object.assign({sourceType: 'module'}, options.acorn);
	return Promise.all(files.map((file, index) => {
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
			const lines = [];
			const namedExports = [];
			for (const node of acorn.parse(code, acornOptions).body) {
				const {type} = node;
				if (type === 'ExportDefaultDeclaration') {
					lines.push(`import _${index} from ${JSON.stringify(file)};`);
					lines.push(`export {_${index} as ${options.rename(null, file)}};`);
				} else if (type === 'ExportNamedDeclaration') {
					for (const specifier of node.specifiers) {
						namedExports.push(specifier.exported.name);
					}
					if (node.declaration) {
						for (const declaration of node.declaration.declarations) {
							namedExports.push(declaration.id.name);
						}
					}
				}
			}
			if (0 < namedExports.length) {
				lines.push(`export {${namedExports.map((name) => `${name} as ${options.rename(name, file)}`)}} from ${JSON.stringify(file)}`);
			}
			if (lines.length === 0) {
				lines.push(`import ${JSON.stringify(file)};`);
			}
			return lines.join('\n');
		});
	}))
	.then((lines) => lines.join('\n'));
};
