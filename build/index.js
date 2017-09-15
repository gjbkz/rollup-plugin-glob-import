const path = require('path');
const fs = require('fs');
const glob = require('glob');
const babel = require('babel-core');
const childProcess = require('child_process');

function build() {
	const projectRoot = path.join(__dirname, '..');
	const srcDirectory = path.join(projectRoot, 'src');
	glob.sync(path.join(srcDirectory, '**', '*'), {nodir: true})
	.forEach((file) => {
		const dest = path.join(projectRoot, 'dist', path.relative(srcDirectory, file));
		childProcess.execSync(`mkdir -p ${path.dirname(dest)}`);
		const input = fs.readFileSync(file);
		if (/test.*src/.test(file)) {
			fs.writeFileSync(dest, input);
		} else {
			console.log(path.relative(projectRoot, file));
			const code = babel.transform([
				'import "babel-polyfill";',
				input.toString('utf8')
			].join('\n'), {presets: [['env', {
				targets: {node: '4'},
				useBuiltIns: true
			}]]}).code;
			fs.writeFileSync(dest, code);
		}
	});
}

module.exports = build;

if (!module.parent) {
	build();
}
