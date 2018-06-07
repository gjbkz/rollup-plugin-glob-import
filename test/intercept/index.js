const path = require('path');
const t = require('tap');
const rollup = require('rollup');
const {runInNewContext} = require('vm');
const globImport = require('../..');

t.test('intercept', (t) => {
	return rollup.rollup({
		input: path.join(__dirname, 'src/index.js'),
		plugins: [
			globImport({
				intercept: (files) => [
					...files.filter((file) => !path.basename(file).startsWith('b')),
					'./bar/d.js',
					'./bar/e.js',
				],
				rename: (name) => name.toUpperCase(),
			}),
		],
	})
	.then((bundle) => bundle.generate({format: 'es'}))
	.then(({code}) => {
		const context = {global: {}};
		runInNewContext(code, context);
		return context.global;
	})
	.then((result) => {
		t.match(result, {
			foo: {
				A: 'a',
				B: undefined,
				C: 'c',
				D: 'd',
				E: 'e',
			},
		});
	});
});
