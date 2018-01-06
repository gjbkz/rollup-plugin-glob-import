module.exports = function generate(files, importer, options) {
	return files.map((file, index) => [
		`import _${index} from ${JSON.stringify(file)};`,
		`export {_${index} as ${options.defaultExport(file)}};`,
		`export * from ${JSON.stringify(file)};`,
	].join('\n')).join('\n');
};
