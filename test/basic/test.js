const path = require('path');
const afs = require('@nlib/afs');
const t = require('tap');
const {rollup} = require('rollup');
const globImport = require('../..');
const {runCode} = require('../util.js');

t.test('basic', async (t) => {
    const directory = __dirname;
    const formats = ['es', 'iife', 'amd', 'cjs', 'umd'];
    const importFormats = ['mixed', 'default', 'named', 'import'];
    await afs.rmrf(path.join(directory, 'output'));
    for (const importFormat of importFormats) {
        for (const format of formats) {
            await t.test(JSON.stringify({importFormat, format}), async (t) => {
                const bundle = await rollup({
                    input: path.join(directory, `src/input.${importFormat}.js`),
                    plugins: [
                        globImport({format: importFormat}),
                    ],
                });
                const {output: [{code}]} = await bundle.generate({format});
                await afs.updateFile(path.join(directory, `output/${format}.${importFormat}.js`), code);
                const result = runCode(code);
                const expected = require(`./expected.${importFormat}.js`);
                t.match(result, expected);
            });
        }
    }
});
