const path = require('path');
module.exports = function generate(files, importer, options) {
	const lines = [];
	for (let i = 0; i < files.length; i++) {
		const file = files[i];
		const id = path.join(path.dirname(importer), file);
		const exported = options.rename(null, id);
		if (exported) {
			lines.push(
				`import _${i} from ${JSON.stringify(file)};`,
				`export {_${i} as ${exported}};`
			);
		}
	}
	return lines.join('\n');
};
