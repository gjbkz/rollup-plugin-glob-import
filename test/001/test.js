const path = require('path');
const assert = require('assert');
const {rollup} = require('rollup');
const globImport = require('../..');

it('should parse *', function () {
	return rollup({
		entry: path.join(__dirname, 'src.js'),
		plugins: [
			globImport({debug: true})
		]
	})
	.then((bundle) => {
		const {code} = bundle.generate({format: 'es'});
		assert.deepEqual(code.trim().split(/\s+/), [
			'console.log(\'001\');',
			'console.log(\'002\');',
			'console.log(\'003\');'
		]);
	});
});
