const path = require('path');
const t = require('tap');
const {rollup} = require('rollup');
const globImport = require('../..');
const {runCode} = require('../util.js');

t.test('rename-default', async (t) => {
    const directory = __dirname;
    const formats = ['es', 'iife', 'amd', 'cjs', 'umd'];
    for (const format of formats) {
        await t.test(format, async (t) => {
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
            t.equal(result.foo, 'foo');
            t.equal(result.bar, undefined);
            t.equal(result.baz, 'bar-default');
        });
    }
});
