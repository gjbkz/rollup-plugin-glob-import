const path = require('path');
const {promises: afs} = require('fs');
const t1 = require('tap');
const {rollup} = require('rollup');
const globImport = require('../..');
const {runCode, clearDirectory} = require('../util.js');

t1.test('filter', async (t2) => {
    const directory = __dirname;
    const formats = ['es'];
    // const formats = ['es', 'iife', 'amd', 'cjs', 'umd'];
    await clearDirectory(path.join(directory, 'output'));
    for (const format of formats) {
        await t2.test(JSON.stringify({format}), async (t3) => {
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
            await afs.writeFile(path.join(directory, `output/${format}.js`), code);
            const result = runCode(code);
            const expected = require('./expected.js');
            t3.match(result, expected);
        });
    }
});
