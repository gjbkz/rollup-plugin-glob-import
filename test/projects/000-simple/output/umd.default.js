(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(factory());
}(this, (function () { 'use strict';

	window.aa = 'aa';
	var a = 'a0';

	window.bb = 'bb';
	var b = 'b0';

	window.cc = 'cc';
	var c = 'c0';

	window.dd = 'dd';
	var d = 'd0';



	var x = /*#__PURE__*/Object.freeze({
		a: a,
		b: b,
		c: c,
		d: d
	});

	window.result = x;

})));
