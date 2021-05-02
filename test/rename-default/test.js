const path = require('path');
const t1 = require('tap');
const {rollup} = require('rollup');
const globImport = require('../..');
const {runCode} = require('../util.js');

t1.test('rename-default', async (t2) => {
    const directory = __dirname;
    const formats = ['es', 'iife', 'amd', 'cjs', 'umd'];
    for (const format of formats) {
        await t2.test(format, async (t3) => {
            const actual = [];
            const bundle = await rollup({
                input: path.join(directory, 'src/input.js'),
                plugins: [
                    globImport({
                        format: 'default',
                        rename: (name, id) => {
                            if (id.endsWith('ignore.js')) {
                                return null;
                            }
                            actual.push({name, id});
                            return name || 'baz';
                        },
                    }),
                ],
            });
            const {output: [{code}]} = await bundle.generate({format});
            const result = runCode(code);
            t3.equal(result.foo, 'foo');
            t3.equal(result.bar, undefined);
            t3.equal(result.baz, 'bar-default');
        });
    }
});
