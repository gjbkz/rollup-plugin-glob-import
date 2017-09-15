require('regenerator-runtime/runtime');
'use strict';

var path = require('path');

function getFSPrefix() {
	var prefix = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : process.cwd();

	var parent = path.join(prefix, '..');
	if (parent === prefix) {
		return prefix;
	}
	return getFSPrefix(parent);
}

var fsPrefix = getFSPrefix();
var rootPath = path.join('/');

function toURLString(filePath) {
	var pathFragments = path.join(filePath).replace(fsPrefix, rootPath).split(path.sep);
	if (!path.isAbsolute(filePath)) {
		pathFragments.unshift('.');
	}
	return pathFragments.join('/');
}

module.exports = toURLString;