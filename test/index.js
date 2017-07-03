const assert = require('assert');
const fs = require('fs');
const path = require('path');
const promisify = require('j1/promisify');
const console = require('j1/console').create('test');
const readdir = promisify(fs.readdir, fs);
const readFile = promisify(fs.readFile, fs);
const {rollup} = require('rollup');
const globImport = require('..');

const projectsDir = path.join(__dirname, 'projects');

async function test(projectName) {
	const entry = path.join(projectsDir, projectName, 'index.js');
	const plugins = [
		globImport({debug: true})
	];
	const bundle = await rollup({
		entry,
		plugins
	});
	const {code: actual} = bundle.generate({format: 'es'});
	const expected = await readFile(path.join(projectsDir, projectName, 'expected.js'), 'utf8');
	assert.deepEqual(
		...[actual, expected]
		.map((code) => {
			return code.trim().split(/(?:\r\n|\r|\n)+/);
		})
	);
}

async function run() {
	const projects = await readdir(projectsDir);
	await Promise.all(projects.map(test));
}

run()
.catch(console.onError);
