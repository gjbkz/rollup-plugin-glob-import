const path = require('path');

function getFileSystemPrefix(prefix) {
	const parent = path.join(prefix, '..');
	if (parent === prefix) {
		return prefix;
	}
	return getFileSystemPrefix(parent);
}

module.exports = getFileSystemPrefix(process.cwd());
