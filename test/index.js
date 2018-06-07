require('./intercept');
require('./invalid-format');
const {rollup} = require('rollup');
const t = require('tap');
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

t.test('globImport', (t) => {

	const projects = [];
	const formats = ['es', 'iife', 'amd', 'cjs', 'umd'];
	const importFormats = ['mixed', 'default', 'named', 'import'];

	t.test('load projects', () => loadProjects().then((loaded) => projects.push(...loaded)));

	t.test('test projects', (t) => {

		projects.forEach((project) => t.test(project.name, (t) => {
			t.test('cleanup project/output', () => rm(project.path('output')));
			importFormats.forEach((importFormat) => {
				t.test(importFormat, (t) => {
					formats.forEach((format) => t.test(`${importFormat}/${format}`, (t) => {
						const data = {
							format,
							importFormat,
						};
						t.test('rollup()', () => {
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
						t.test('bundle.generate()', () => {
							return data.bundle.generate({format})
							.then((result) => Object.assign(data, result));
						});
						t.test(`output ${format}.${importFormat}.js`, () => {
							return project.writeFile(`${format}.${importFormat}.js`, data.code);
						});
						t.test('check modules', (t) => {
							project.testModules(t, data);
							t.end();
						});
						t.test('run the generated code', (t) => {
							data.sandbox = createSandbox();
							runInNewContext(data.code, data.sandbox);
							t.end();
						});
						t.test(`load expected.${importFormat}.js`, (t) => {
							data.expected = require(project.path(`expected.${importFormat}.js`));
							t.match(data.sandbox, data.expected);
							t.end();
						});
						t.end();
					}));
					t.end();
				});
			});
			t.end();
		}));

		t.end();

	});

	t.end();

});
