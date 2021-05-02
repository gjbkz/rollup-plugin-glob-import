const path = require('path');
const {promises: afs} = require('fs');
const t1 = require('tap');
const {rollup} = require('rollup');
const globImport = require('../..');
const {runCode, clearDirectory} = require('../util.js');

t1.test('basic', async (t2) => {
    const directory = __dirname;
    const formats = ['es', 'iife', 'amd', 'cjs', 'umd'];
    const importFormats = ['mixed', 'default', 'named', 'import'];
    await clearDirectory(path.join(directory, 'output'));
    for (const importFormat of importFormats) {
        for (const format of formats) {
            await t2.test(JSON.stringify({importFormat, format}), async (t3) => {
                const bundle = await rollup({
                    input: path.join(directory, `src/input.${importFormat}.js`),
                    plugins: [
                        globImport({format: importFormat}),
                    ],
                });
                const {output: [{code}]} = await bundle.generate({format});
                await afs.writeFile(path.join(directory, `output/${format}.${importFormat}.js`), code);
                const result = runCode(code);
                const expected = require(`./expected.${importFormat}.js`);
                t3.match(result, expected);
            });
        }
    }
});
