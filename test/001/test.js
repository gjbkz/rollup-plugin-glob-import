const path = require('path');
const assert = require('assert');
const {rollup} = require('rollup');
const globImport = require('../..');

it('should parse *', function () {
	const entry = path.join(__dirname, 'src.js');
	const plugins = [
		globImport({debug: true})
	];
	return rollup({
		entry,
		plugins
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
