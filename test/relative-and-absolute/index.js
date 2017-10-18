function test(run) {

	const assert = require('assert');
	const path = require('path');
	const vm = require('vm');
	const {rollup} = require('rollup');
	const globImport = require('../../src');
	const toURLString = require('../../src/toURLString');

	const input = path.join(__dirname, 'src', 'index.js');
	const params = {};

	return run('bundle', () => {
		return rollup({
			input,
			plugins: [
				{
					transform(source, id) {
						return source.split('__dirname').join(toURLString(path.dirname(id)));
					}
				},
				globImport({debug: true}),
				{
					transform(source, id) {
						if (id.includes('_deps1_-star-_js.js')) {
							params.deps1 = source;
						}
						if (id.includes('_deps2_-star-_js.js')) {
							params.deps2 = source;
						}
					}
				}
			]
		})
		.then((bundle) => {
			params.bundle = bundle;
		});
	})
	.then(() => {
		return run('check relative glob pattern', () => {
			assert.equal(
				params.deps1.trim(),
				[
					`import './deps1/a.js';`,
					`import './deps1/b.js';`,
				].join('\n')
			);
		});
	})
	.then(() => {
		return run('check absolute glob pattern', () => {
			assert.equal(
				params.deps2.trim(),
				[
					`import '${toURLString(__dirname)}/src/deps2/c.js';`,
					`import '${toURLString(__dirname)}/src/deps2/d.js';`,
				].join('\n')
			);
		});

	})
	.then(() => {
		return run('generate code', () => {
			return params.bundle.generate({format: 'es'})
			.then(({code}) => {
				params.code = code;
			});
		});
	})
	.then(() => {
		return run('run code', () => {
			params.result = {};
			vm.runInNewContext(params.code, {result: params.result});
		});
	})
	.then(() => {
		return run('test the result', () => {
			const expected = {
				a: 'a',
				b: 'b',
				c: 'c',
				d: 'd',
			};
			assert.deepEqual(params.result, expected);
		});
	});

}

module.exports = test;
