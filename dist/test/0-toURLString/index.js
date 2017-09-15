require('regenerator-runtime/runtime');
'use strict';

function test(run) {

	var assert = require('assert');
	var toURLString = require('../../toURLString');

	run('slash', function (run) {

		run('absolute', function () {
			var source = '/a/b/c';
			var expected = '/a/b/c';
			var actual = toURLString(source);
			assert.equal(actual, expected);
		});

		run('relative', function () {
			var source = 'a/b/c';
			var expected = './a/b/c';
			var actual = toURLString(source);
			assert.equal(actual, expected);
		});
	});

	if (process.platform.startsWith('win')) {
		run('backslash', function (run) {

			run('drive + absolute', function () {
				var source = 'C:\\a\\b\\c';
				var expected = '/a/b/c';
				var actual = toURLString(source);
				assert.equal(actual, expected);
			});

			run('absolute', function () {
				var source = '\\a\\b\\c';
				var expected = '/a/b/c';
				var actual = toURLString(source);
				assert.equal(actual, expected);
			});

			run('relative', function () {
				var source = 'a\\b\\c';
				var expected = './a/b/c';
				var actual = toURLString(source);
				assert.equal(actual, expected);
			});
		});
	}
}

module.exports = test;