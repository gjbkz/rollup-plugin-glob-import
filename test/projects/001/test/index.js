const assert = require('assert');
const vm = require('vm');

function test(code) {
	const value = Date.now();
	const context = {value};
	vm.runInNewContext(code, context);
	assert.deepEqual(context, {
		value,
		a: value * 2,
		b: value * 3,
		c: value * 4
	});
}

module.exports = test;
