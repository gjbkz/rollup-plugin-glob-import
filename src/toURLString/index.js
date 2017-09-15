const path = require('path');

function getFSPrefix(prefix = process.cwd()) {
	const parent = path.join(prefix, '..');
	if (parent === prefix) {
		return prefix;
	}
	return getFSPrefix(parent);
}

const fsPrefix = getFSPrefix();
const rootPath = path.join('/');

function toURLString(filePath) {
	const pathFragments = path.join(filePath).replace(fsPrefix, rootPath).split(path.sep);
	if (!path.isAbsolute(filePath)) {
		pathFragments.unshift('.');
	}
	return pathFragments.join('/');
}

module.exports = toURLString;
