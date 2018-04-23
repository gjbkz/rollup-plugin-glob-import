const path = require('path');
const fs = require('fs');
const acorn = require('acorn');

module.exports = function generate(files, importer, options) {
	const acornOptions = Object.assign({sourceType: 'module'}, options.acorn);
	return Promise.all(files.map((file, index) => {
		const id = path.join(path.dirname(importer), file);
		return new Promise((resolve, reject) => {
			fs.readFile(id, 'utf8', (error, code) => {
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
				if (type === 'ExportAllDeclaration') {
					let from = node.source.value;
					if (from.startsWith('.')) {
						from = `./${path.join(path.dirname(file), from).split(path.sep).join('/')}`;
					}
					lines.push(`export * from ${JSON.stringify(from)};`);
				} else if (type === 'ExportDefaultDeclaration') {
					lines.push(`import _${index} from ${JSON.stringify(file)};`);
					lines.push(`export {_${index} as ${options.rename(null, id)}};`);
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
				lines.push(`export {${namedExports.map((name) => `${name} as ${options.rename(name, id)}`)}} from ${JSON.stringify(file)}`);
			}
			if (lines.length === 0) {
				lines.push(`import ${JSON.stringify(file)};`);
			}
			return lines.join('\n');
		});
	}))
	.then((lines) => lines.join('\n'));
};
