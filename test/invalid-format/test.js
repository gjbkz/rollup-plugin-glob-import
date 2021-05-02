const t1 = require('tap');
const globImport = require('../..');

t1.test('invalid format', (t2) => {
    t2.throws(() => globImport({format: 'foo'}));
    t2.end();
});
