const path = require('path');
const assert = require('assert');
const {rollup} = require('rollup');
const globImport = require('../..');

it('should parse *', async function () {
	const bundle = await rollup({
		entry: path.join(__dirname, 'src.js'),
		plugins: [
			globImport({debug: true})
		]
	});
	const {code} = bundle.generate({format: 'es'});
	assert.deepEqual(code.trim().split(/\s+/), [
		'console.log(\'001\');',
		'console.log(\'002\');',
		'console.log(\'003\');'
	]);
});
