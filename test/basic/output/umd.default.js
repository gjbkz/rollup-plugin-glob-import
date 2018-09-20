(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (factory());
}(this, (function () { 'use strict';

    global.aa = 'aa';
    var a = 'a0';

    global.bb = 'bb';
    var b = 'b0';

    global.cc = 'cc';
    var c = 'c0';

    global.ee = 'ee';

    global.dd = 'dd';
    var d = 'd0';



    var x = /*#__PURE__*/Object.freeze({
        a: a,
        b: b,
        c: c,
        d: d
    });

    global.result = x;

})));
