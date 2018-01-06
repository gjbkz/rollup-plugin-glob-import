module.exports = [
	'foo encode:1250',
	'bar encode:1251',
	{
		cp1250: (value) => typeof value === 'function',
		cp1251: (value) => typeof value === 'function',
		otherStuff1250: 'encode:1250',
		otherStuff1251: 'encode:1251',
		conflictStuff: 'conflictName1250',
	},
];
