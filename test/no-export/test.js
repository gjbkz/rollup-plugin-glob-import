const path = require('path');
const afs = require('@nlib/afs');
const t = require('tap');
const {rollup} = require('rollup');
const globImport = require('../..');
const {runCode} = require('../util.js');

t.test('empty-pattern', async (t) => {
    const directory = __dirname;
    const formats = ['es', 'iife', 'amd', 'cjs', 'umd'];
    await afs.rmrf(path.join(directory, 'output'));
    for (const format of formats) {
        await t.test(JSON.stringify(format), async (t) => {
            const bundle = await rollup({
                input: path.join(directory, 'src/input.js'),
                plugins: [
                    globImport({format: 'mixed'}),
                ],
            });
            const output = await bundle.generate({format});
            const result = runCode(output.code);
            t.match(result, {foo: 'foo'});
        });
    }
});
