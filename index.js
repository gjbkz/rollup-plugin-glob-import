const path = require('path');
const promisify = require('j1/promisify');
const console = require('j1/console').create('globImport');
const {createFilter} = require('rollup-pluginutils');
const glob = promisify(require('glob'));

function getPseudoName(importeePatten) {
	return importeePatten
	.split(path.sep)
	.join('_')
	.replace(/[*.]/g, (char) => {
		return char.codePointAt(0).toString(16);
	});
}

function globImport({include, exclude, debug} = {}) {
	const filter = createFilter(include, exclude);
	const codes = new Map();
	return {
		name: 'glob-import',
		async resolveId(importee, importer) {
			if (!filter(importee) || importee.indexOf('*') < 0) {
				return null;
			}
			const dir = path.dirname(importer);
			const files = await glob(path.join(dir, importee));
			const code = files
			.map((file) => {
				return `import './${path.relative(dir, file)}'`;
			}).join('\n');
			const id = path.join(dir, getPseudoName(importee));
			if (debug) {
				console.info(`${importee}\n${code}`);
			}
			codes.set(id, code);
			return id;
		},
		load(id) {
			return codes.get(id);
		}
	};
}

module.exports = globImport;
