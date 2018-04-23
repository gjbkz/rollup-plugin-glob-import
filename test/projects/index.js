const path = require('path');
const fs = require('fs');
const rollup = require('rollup');
const test = require('@nlib/test');
const {runInNewContext} = require('vm');
const promisify = require('@nlib/promisify');
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const globImport = require('../..');
test('projects', (test) => {
	const projects = [];
	test('get projects', () => {
		return readdir(__dirname)
		.then((names) => {
			return Promise.all(names.map((name) => {
				return stat(path.join(__dirname, name))
				.then((stats) => {
					if (stats.isDirectory()) {
						projects.push(name);
					}
				});
			}));
		});
	});
	test('test projects', (test) => {
		for (const name of projects.slice(0, 1)) {
			test(name, (test) => {
				const directory = path.join(__dirname, name);
				for (const options of require(`./${name}/options.js`)) {
					test(`options: ${JSON.stringify(options)}`, (test) => {
						const results = {};
						test('bundle', () => {
							return rollup.rollup({
								input: path.join(directory, 'src', 'index.js'),
								plugins: [globImport(options)],
							})
							.then((bundle) => {
								results.bundle = bundle;
							});
						});
						test('generate', () => {
							return results.bundle.generate({format: 'es'})
							.then(({code}) => {
								if (!code.trim()) {
									throw new Error('empty code');
								}
								results.code = code;
							});
						});
						test('run the code', () => {
							results.context = {result: []};
							runInNewContext(results.code, results.context);
						});
						test('check the result', (test) => {
							test.compare(results.context.result, require(`./${name}/expected`));
						});
					});
				}
			});
		}
	});
});
