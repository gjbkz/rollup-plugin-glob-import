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
		test('get projects', () => {
			const directory = path.join(__dirname, 'projects');
			return readdir(directory)
			.then((names) => {
				projects.push(...names.map((name) => path.join(directory, name)));
			});
		});
		test('test projects', (test) => {
			for (const directory of projects) {
				const results = {};
				test('bundle', () => {
					return rollup.rollup({
						input: path.join(directory, 'src', 'index.js'),
						plugins: [globImport()],
					})
					.then((bundle) => {
						results.bundle = bundle;
					});
				});
				test('generate', () => {
					return results.bundle.generate({
						format: 'es',
					})
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
				test('assert the result', (test) => {
					test.object(results.context.result, results.expected);
				});
			}
		});
	});
});
