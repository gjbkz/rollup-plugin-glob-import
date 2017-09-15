const path = require('path');
const fs = require('fs');
const $console = require('j1/console').create('build');
const promisify = require('j1/promisify');
const writeFile = require('j1/writeFile');
const cp = require('j1/cp');
const glob = promisify(require('glob'));
const readFile = promisify(fs.readFile, fs);
const babel = require('babel-core');

async function build() {
	const projectRoot = path.join(__dirname, '..');
	const srcDirectory = path.join(projectRoot, 'src');
	const files = await glob(path.join(srcDirectory, '**', '*.js'));
	for (const file of files) {
		const console = $console.create(path.relative(projectRoot, file));
		const dest = path.join(projectRoot, 'dist', path.relative(srcDirectory, file));
		if ((/test.*src/).test(file)) {
			await cp(file, dest);
		} else {
			console.info('read');
			const input = await readFile(file, 'utf8');
			console.info('transpile');
			const code = [
				'require(\'regenerator-runtime/runtime\');',
				babel.transform(input, {presets: [['env', {targets: {node: '4'}}]]}).code
			].join('\n');
			console.info('write');
			await writeFile(dest, code);
		}
	}
}

module.exports = build;

if (!module.parent) {
	build()
	.catch((error) => {
		$console.error(error);
		process.exit(1);
	});
}
