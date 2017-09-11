async function test(run) {

	const assert = require('assert');
	const path = require('path');
	const vm = require('vm');
	const {rollup} = require('rollup');
	const globImport = require('../..');

	const input = path.join(__dirname, 'src', 'index.js');
	const params = {};

	await run('bundle', async () => {
		params.bundle = await rollup({
			input,
			plugins: [
				{
					transform(source, id) {
						return source.split('__dirname').join(path.dirname(id));
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
		});
	});

	await run('check relative glob pattern', async () => {
		assert.equal(
			params.deps1.trim(),
			[
				'import \'./deps1/a.js\';',
				'import \'./deps1/b.js\';',
			].join('\n')
		);
	});

	await run('check absolute glob pattern', async () => {
		assert.equal(
			params.deps2.trim(),
			[
				`import \'${__dirname}/src/deps2/c.js\';`,
				`import \'${__dirname}/src/deps2/d.js\';`,
			].join('\n')
		);
	});

	await run('generate code', async () => {
		params.code = (await params.bundle.generate({format: 'es'})).code;
	});

	await run('run code', () => {
		params.result = {};
		vm.runInNewContext(params.code, {result: params.result});
	});

	await run('test the result', async () => {
		const expected = {
			a: 'a',
			b: 'b',
			c: 'c',
			d: 'd',
		};
		assert.deepEqual(params.result, expected);
	});

}

module.exports = test;
