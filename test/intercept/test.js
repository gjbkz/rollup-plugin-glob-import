const path = require('path');
const t1 = require('tap');
const rollup = require('rollup');
const globImport = require('../..');
const {runCode} = require('../util.js');

t1.test('intercept', async (t2) => {
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
    const {output: [{code}]} = await bundle.generate({format: 'es'});
    const result = runCode(code);
    t2.match(result, {
        foo: {
            A: 'a',
            B: undefined,
            C: 'c',
            D: 'd',
            E: 'e',
        },
    });
});
