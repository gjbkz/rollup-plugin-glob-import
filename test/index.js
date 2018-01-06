const assert = require('assert');
const path = require('path');
const fs = require('fs');
const rollup = require('rollup');
const test = require('@nlib/test');
const {runInNewContext} = require('vm');
const promisify = require('@nlib/promisify');
const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const globImport = require('..');

test('globImport', (test) => {
	test('valid', (test) => {
		const projects = [];
		const projectsDirectory = path.join(__dirname, 'projects');
		test('get projects', () => {
			return readdir(projectsDirectory)
			.then((names) => {
				projects.push(...names);
			});
		});
		test('test projects', (test) => {
			for (const name of projects) {
				test(name, (test) => {
					const directory = path.join(projectsDirectory, name);
					for (const options of require(`./projects/${name}/options.js`)) {
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
									results.code = code;
								});
							});
							test('run the code', () => {
								results.context = {};
								runInNewContext(results.code, results.context);
							});
							test('load expected result', () => {
								return readFile(path.join(directory, 'expected.json'), 'utf8')
								.then((json) => {
									results.expected = JSON.parse(json);
								});
							});
							test('check the result', (test) => {
								test.object(results.context.result, results.expected);
							});
						});
					}
				});
			}
		});
	});
	test('invalid format', () => {
		assert.throws(() => {
			globImport({format: 'foo'});
		});
	});
});
