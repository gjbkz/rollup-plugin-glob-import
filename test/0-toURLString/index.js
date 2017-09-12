function test(run) {

	const assert = require('assert');
	const toURLString = require('../../toURLString');

	run('slash', (run) => {

		run('absolute', () => {
			const source = '/a/b/c';
			const expected = '/a/b/c';
			const actual = toURLString(source);
			assert.equal(actual, expected);
		});

		run('relative', () => {
			const source = 'a/b/c';
			const expected = './a/b/c';
			const actual = toURLString(source);
			assert.equal(actual, expected);
		});

	});

	if (process.platform.startsWith('win')) {
		run('backslash', (run) => {

			run('drive + absolute', () => {
				const source = 'C:\\a\\b\\c';
				const expected = '/a/b/c';
				const actual = toURLString(source);
				assert.equal(actual, expected);
			});

			run('absolute', () => {
				const source = '\\a\\b\\c';
				const expected = '/a/b/c';
				const actual = toURLString(source);
				assert.equal(actual, expected);
			});

			run('relative', () => {
				const source = 'a\\b\\c';
				const expected = './a/b/c';
				const actual = toURLString(source);
				assert.equal(actual, expected);
			});

		});
	}

}

module.exports = test;
