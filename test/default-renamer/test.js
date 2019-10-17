const t = require('tap');
const {defaultRenamer} = require('../..');

t.test('defaultRenamer', (t) => {
    [
        {input: ['aaa', 'foo-bar.js'], expected: 'aaa'},
        {input: ['aaa', 'foo-bar.d.ts'], expected: 'aaa'},
        {input: [null, 'foo-bar.js'], expected: 'fooBar'},
        {input: [null, 'foo-bar.d.ts'], expected: 'fooBarD'},
    ].forEach(({input, expected}) => {
        t.test(`${JSON.stringify(input)} → ${expected}`, (t) => {
            const actual = defaultRenamer(...input);
            t.equal(actual, expected);
            t.end();
        });
    });
    t.end();
});
