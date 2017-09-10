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
			console.log('importee:', importee);
			if (!filter(importee) || !importee.includes('*')) {
				return null;
			}
			if (!path.isAbsolute(importee)) {
				const dir = path.dirname(importer);
				importee = path.join(dir, importee);
			}
			const files = await glob(importee);
			const code = files
			.map((file) => {
				return `import '${file}'`;
			}).join('\n');
			const id = path.join(__dirname, getPseudoName(importee));
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
