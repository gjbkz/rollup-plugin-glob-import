module.exports = function generate(files) {
	return files.map((file) => `export * from ${JSON.stringify(file)};`).join('\n');
};
