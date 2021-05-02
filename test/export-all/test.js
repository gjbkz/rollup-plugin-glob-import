const path = require('path');
const t1 = require('tap');
const {rollup} = require('rollup');
const globImport = require('../..');
const {runCode} = require('../util.js');

t1.test('export-all', async (t2) => {
    const directory = __dirname;
    const formats = ['es', 'iife', 'amd', 'cjs', 'umd'];
    for (const format of formats) {
        await t2.test(format, async (t3) => {
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
            t3.equal(result.foo.bar1, 'bar1');
            t3.equal(result.foo.bar, 'bar-default');
            t3.equal(result.foo.baz, 'baz');
        });
    }
});
