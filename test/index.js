const {rollup} = require('rollup');
const test = require('@nlib/test');
const rm = require('@nlib/rm');
const {loadProjects} = require('./projects');
const globImport = require('..');
const {runInNewContext} = require('vm');
const createSandbox = () => {
	const sandbox = {
		get window() {
			return sandbox;
		},
		amd: {
			defined: new Map(),
			loaded: new Map(),
		},
		define: (id, dependencies, factory) => {
			if (typeof id !== 'string') {
				factory = dependencies;
				dependencies = id;
				id = '';
			}
			if (!Array.isArray(dependencies)) {
				factory = dependencies;
				dependencies = [];
			}
			factory();
		},
	};
	return sandbox;
};

test('globImport', (test) => {

	const projects = [];
	const formats = ['es', 'iife', 'amd', 'cjs', 'umd'];
	const importFormats = ['mixed', 'default', 'named', 'import'];

	test('load projects', () => loadProjects().then((loaded) => projects.push(...loaded)));

	test('test projects', (test) => {

		projects.forEach((project) => test(project.name, (test) => {
			test('cleanup project/output', () => rm(project.path('output')));
			importFormats.forEach((importFormat) => {
				test(importFormat, (test) => {
					formats.forEach((format) => test(`${importFormat}/${format}`, (test) => {
						const data = {
							format,
							importFormat,
						};
						test('rollup()', () => {
							return rollup({
								input: project.path('src', `input.${importFormat}.js`),
								plugins: [
									globImport({
										format: importFormat,
									}),
								],
							})
							.then((bundle) => {
								data.bundle = bundle;
							});
						});
						test('bundle.generate()', () => {
							return data.bundle.generate({format})
							.then((result) => Object.assign(data, result));
						});
						test(`output ${format}.${importFormat}.js`, () => {
							return project.writeFile(`${format}.${importFormat}.js`, data.code);
						});
						test('check modules', (test) => {
							project.testModules(test, data);
						});
						test('run the generated code', () => {
							data.sandbox = createSandbox();
							runInNewContext(data.code, data.sandbox);
						});
						test(`load expected.${importFormat}.js`, (test) => {
							data.expected = require(project.path(`expected.${importFormat}.js`));
							test.compare(data.sandbox, data.expected);
						});
					}));
				});
			});
		}));

	});

});
