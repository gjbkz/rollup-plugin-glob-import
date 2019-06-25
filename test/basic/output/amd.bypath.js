define(function () { 'use strict';

    global.aa = 'aa';
    var a = 'a0';
    const a1 = 'a1';
    function a2() {}
    class A5 {
        static get name() {
            return 'A5';
        }
    }

    var _0 = /*#__PURE__*/Object.freeze({
        default: a,
        a1: a1,
        a2: a2,
        a3: a1,
        a4: a2,
        A5: A5
    });

    global.bb = 'bb';
    var b = 'b0';
    const b1 = 'b1';
    function b2() {}
    class B5 {
        static get name() {
            return 'B5';
        }
    }

    var _1 = /*#__PURE__*/Object.freeze({
        default: b,
        b1: b1,
        b2: b2,
        b3: b1,
        b4: b2,
        B5: B5
    });

    global.cc = 'cc';
    var c = 'c0';
    const c1 = 'c1';
    function c2() {}
    class C5 {
        static get name() {
            return 'C5';
        }
    }

    var _2 = /*#__PURE__*/Object.freeze({
        default: c,
        c1: c1,
        c2: c2,
        c3: c1,
        c4: c2,
        C5: C5
    });

    global.ee = 'ee';

    global.dd = 'dd';
    var d = 'd0';
    const d1 = 'd1';
    function d2() {}
    class D5 {
        static get name() {
            return 'D5';
        }
    }

    var _3 = /*#__PURE__*/Object.freeze({
        default: d,
        d1: d1,
        d2: d2,
        d3: d1,
        d4: d2,
        D5: D5
    });

    var _46__47_foo_47__42__42__47__42__46_js = {
    "./foo/a.js": _0,
    "./foo/b.js": _1,
    "./foo/bar/c.js": _2,
    "./foo/bar/d.js": _3,
    };

    var x = /*#__PURE__*/Object.freeze({
        default: _46__47_foo_47__42__42__47__42__46_js
    });

    global.result = x;

});
