(function () {
	'use strict';

	window.aa = 'aa';
	const a1 = 'a1';
	function a2() {}
	class A5 {
		static get name() {
			return 'A5';
		}
	}

	window.bb = 'bb';
	const b1 = 'b1';
	function b2() {}
	class B5 {
		static get name() {
			return 'B5';
		}
	}

	window.cc = 'cc';
	const c1 = 'c1';
	function c2() {}
	class C5 {
		static get name() {
			return 'C5';
		}
	}

	window.dd = 'dd';
	const d1 = 'd1';
	function d2() {}
	class D5 {
		static get name() {
			return 'D5';
		}
	}



	var x = /*#__PURE__*/Object.freeze({
		a1: a1,
		a2: a2,
		a3: a1,
		a4: a2,
		A5: A5,
		b1: b1,
		b2: b2,
		b3: b1,
		b4: b2,
		B5: B5,
		c1: c1,
		c2: c2,
		c3: c1,
		c4: c2,
		C5: C5,
		d1: d1,
		d2: d2,
		d3: d1,
		d4: d2,
		D5: D5
	});

	window.result = x;

}());
