const t1 = require('tap');
const imported = require('../..');

t1.test('plugin', (t2) => {
    t2.equal(imported, imported.plugin);
    t2.end();
});

t1.test('defaultRenamer', (t2) => {
    const tests = [
        {input: ['aaa', 'foo-bar.js'], expected: 'aaa'},
        {input: ['aaa', 'foo-bar.d.ts'], expected: 'aaa'},
        {input: [null, 'foo-bar.js'], expected: 'fooBar'},
        {input: [null, 'foo-bar.d.ts'], expected: 'fooBarD'},
    ];
    for (const {input, expected} of tests) {
        t2.test(`${JSON.stringify(input)} → ${expected}`, (t3) => {
            const actual = imported.defaultRenamer(...input);
            t3.equal(actual, expected);
            t3.end();
        });
    }
    t2.end();
});

t1.test('camelCase', (t2) => {
    const tests = [
        {input: 'aabbccdd', expected: 'aabbccdd'},
        ...[...'-+*/:;.\'"`?!&~|<>^%#=@[]{}() \\'].map((c) => ({
            input: `aa${c}bb${c}cc${c}dd`, expected: 'aaBbCcDd',
        })),
    ];
    for (const {input, expected} of tests) {
        t2.test(`${JSON.stringify(input)} → ${expected}`, (t3) => {
            const actual = imported.camelCase(input);
            t3.equal(actual, expected);
            t3.end();
        });
    }
    t2.end();
});
