async function test(run) {

	const assert = require('assert');
	const fs = require('fs');
	const path = require('path');
	const vm = require('vm');
	const promisify = require('j1/promisify');
	const readdir = promisify(fs.readdir, fs);
	const readFile = promisify(fs.readFile, fs);
	const {rollup} = require('rollup');
	const globImport = require('..');
	const projectsDir = path.join(__dirname, 'projects');

	for (const projectName of await readdir(projectsDir)) {
		await run(projectName, async (run) => {

			const projectDir = path.join(projectsDir, projectName);
			const params = {};

			await run('bundle', async () => {
				params.bundle = await rollup({
					entry: path.join(projectDir, 'index.js'),
					plugins: [
						{
							resolveId(importee, importer) {
								if (importer && importee.includes('__dirname')) {
									return importee
									.split('__dirname')
									.join(path.dirname(importer))
								}
							},
						},
						globImport({debug: true})
					]
				});
			});

			await run('generate code', async () => {
				params.code = (await params.bundle.generate({format: 'es'})).code;
			});

			await run('run code', () => {
				params.result = {};
				vm.runInNewContext(params.code, {result: params.result});
			});

			await run('load expected data', async () => {
				params.expected = JSON.parse(await readFile(path.join(projectDir, 'expected.json'), 'utf8'));
			});

			await run('test the result', async () => {
				const {result, expected} = params;
				assert.equal(result.css, expected.css);
				assert.deepEqual(result.style, expected.style);
			});

		});
	}
}

module.exports = test;
