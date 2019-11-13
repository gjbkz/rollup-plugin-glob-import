const path = require('path');
const afs = require('@nlib/afs');
const t = require('tap');
const {rollup} = require('rollup');
const globImport = require('../..');
const {runCode} = require('../util.js');

t.test('filter', async (t) => {
    const directory = __dirname;
    const formats = ['es', 'iife', 'amd', 'cjs', 'umd'];
    await afs.rmrf(path.join(directory, 'output'));
    for (const format of formats) {
        await t.test(JSON.stringify({format}), async (t) => {
            const bundle = await rollup({
                input: path.join(directory, 'src/input.js'),
                plugins: [
                    globImport({
                        format: 'named',
                        include: path.join(directory, 'src/a.js'),
                    }),
                    globImport({
                        format: 'default',
                        include: path.join(directory, 'src/b.js'),
                    }),
                ],
            });
            const {output: [{code}]} = await bundle.generate({format});
            await afs.updateFile(path.join(directory, `output/${format}.js`), code);
            const result = runCode(code);
            const expected = require('./expected.js');
            t.match(result, expected);
        });
    }
});
