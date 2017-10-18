const path = require('path');
const fileSystemPrefix = require('../fileSystemPrefix');
const rootPath = path.join('/');

function toURLString(filePath) {
	const normalizedFilePath = path.normalize(filePath);
	const pathFragments = normalizedFilePath.replace(fileSystemPrefix, rootPath).split(path.sep);
	if (!path.isAbsolute(normalizedFilePath)) {
		pathFragments.unshift('.');
	}
	return pathFragments.join('/');
}

module.exports = toURLString;
