const fs = require('fs');
const path = require('path');
const promisify = require('j1/promisify');
const console = require('j1/console').create('test');
const readdir = promisify(fs.readdir, fs);
const {rollup} = require('rollup');
const globImport = require('..');

const projectsDir = path.join(__dirname, 'projects');

async function test(projects) {
	const projectName = projects.shift();
	if (!projectName) {
		return;
	}
	const bundle = await rollup({
		entry: path.join(projectsDir, projectName, 'index.js'),
		plugins: [
			globImport({debug: true})
		]
	});
	const {code} = bundle.generate({format: 'es'});
	await Promise.resolve(require(`./projects/${projectName}/test`)(code));
	await test(projects);
}

readdir(projectsDir)
.then(test)
.catch(function (error) {
	console.onError(error);
	process.exit(1);
});
