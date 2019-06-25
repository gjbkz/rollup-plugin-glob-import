module.exports = {
    aa: 'aa',
    bb: 'bb',
    cc: 'cc',
    dd: 'dd',
    ee: 'ee',
    result: {
        default: {
            './foo/a.js': {
                default: 'a0',
                a1: 'a1',
                a2: Function,
                a3: 'a1',
                a4: Function,
                A5: Function,
            },
            './foo/b.js': {
                default: 'b0',
                b1: 'b1',
                b2: Function,
                b3: 'b1',
                b4: Function,
                B5: Function,
            },
            './foo/bar/c.js': {
                default: 'c0',
                c1: 'c1',
                c2: Function,
                c3: 'c1',
                c4: Function,
                C5: Function,
            },
            './foo/bar/d.js': {
                default: 'd0',
                d1: 'd1',
                d2: Function,
                d3: 'd1',
                d4: Function,
                D5: Function,
            },
        },
    },
};
