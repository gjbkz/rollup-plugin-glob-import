const path = require('path');
const t1 = require('tap');
const {rollup} = require('rollup');
const globImport = require('../..');
const {runCode, clearDirectory} = require('../util.js');

t1.test('empty-pattern', async (t2) => {
    const directory = __dirname;
    const formats = ['es', 'iife', 'amd', 'cjs', 'umd'];
    await clearDirectory(path.join(directory, 'output'));
    for (const format of formats) {
        await t2.test(JSON.stringify(format), async (t3) => {
            const bundle = await rollup({
                input: path.join(directory, 'src/input.js'),
                plugins: [
                    globImport({format: 'mixed'}),
                ],
            });
            const {output: [{code}]} = await bundle.generate({format});
            const result = runCode(code);
            t3.match(result, {foo: 'foo'});
        });
    }
});
