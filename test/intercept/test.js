const path = require('path');
const t = require('tap');
const rollup = require('rollup');
const globImport = require('../..');
const {runCode} = require('../util.js');

t.test('intercept', async (t) => {
    const bundle = await rollup.rollup({
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
    });
    const {code} = await bundle.generate({format: 'es'});
    const result = runCode(code);
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
