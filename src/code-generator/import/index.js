module.exports = function generate(files) {
	return files.map((file) => `import ${JSON.stringify(file)};`).join('\n');
};
