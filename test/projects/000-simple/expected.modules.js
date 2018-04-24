const path = require('path');
module.exports = (test, {modules, importFormat}) => {
	const actual = {};
	for (const file of modules) {
		actual[path.relative(__dirname, file)] = true;
	}
	const expected = {
		[path.join('src', `input.${importFormat}.js`)]: true,
		[path.join('src', 'foo', 'a.js')]: true,
		[path.join('src', 'foo', 'b.js')]: true,
		[path.join('src', 'foo', 'bar', 'c.js')]: true,
		[path.join('src', 'foo', 'bar', 'd.js')]: true,
	};
	test.compare(actual, expected);
};
