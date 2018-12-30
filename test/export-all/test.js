const path = require('path');
const t = require('tap');
const {rollup} = require('rollup');
const globImport = require('../..');
const {runCode} = require('../util.js');

t.test('export-all', async (t) => {
    const directory = __dirname;
    const formats = ['es', 'iife', 'amd', 'cjs', 'umd'];
    for (const format of formats) {
        await t.test(format, async (t) => {
            const bundle = await rollup({
                input: path.join(directory, 'src/input.js'),
                plugins: [
                    globImport(),
                    {
                        name: 'baz',
                        resolveId(importee) {
                            return importee === 'baz' ? importee : null;
                        },
                        load(id) {
                            return id === 'baz' ? 'export const baz = "baz";' : null;
                        },
                    },
                ],
            });
            const {output: [{code}]} = await bundle.generate({format});
            const result = runCode(code);
            t.equal(result.foo.bar1, 'bar1');
            t.equal(result.foo.bar, 'bar-default');
            t.equal(result.foo.baz, 'baz');
        });
    }
});
