module.exports = {
    extends: [
        '@nlib/eslint-config',
    ],
    env: {
        es6: true,
        node: true,
    },
    overrides: [
        {
            files: ['test/**'],
            rules: {
                'no-loop-func': 'off',
            },
        },
        {
            files: ['test/*/src/**/*'],
            rules: {
                'func-style': 'off',
            },
        },
    ],
};
