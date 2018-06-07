const t = require('tap');
const globImport = require('../..');

t.test('invalid format', (t) => {
	t.throws(() => globImport({format: 'foo'}));
	t.end();
});
