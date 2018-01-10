const assert = require('assert');
const test = require('@nlib/test');
const globImport = require('..');
test('invalid format', () => {
	assert.throws(() => globImport({format: 'foo'}));
});
require('./projects');
require('./watch');
