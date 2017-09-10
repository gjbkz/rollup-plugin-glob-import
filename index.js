const path = require('path');
const promisify = require('j1/promisify');
const acorn = require('acorn');
const walk = require('acorn/dist/walk');
const {createFilter} = require('rollup-pluginutils');
const glob = promisify(require('glob'));

function globImport({include, exclude} = {}) {
	const filter = createFilter(include, exclude);
	return {
		name: 'glob-import',
		async transform(source, id) {
			if (!filter(id)) {
				return null;
			}
			const globImports = [];
			const ast = acorn.parse(source, {
				sourceType: 'module',
			});
			walk.simple(ast, {
				ImportDeclaration({
					specifiers: {length},
					source: {type, value: from},
					start,
					end,
				}) {
					if (length === 0 && type === 'Literal' && from.includes('*')) {
						globImports.push({
							start,
							end,
							from,
						});
					}
				}
			});
			if (0 < globImports.length) {
				const baseDir = path.dirname(id);
				globImports
				.sort(({start: a}, {start: b}) => {
					return a < b ? 1 : -1;
				});
				for (const {from, start, end} of globImports) {
					const files = await glob(
						path.isAbsolute(from)
						? from
						: path.join(baseDir, from)
					);
					source = [
						source.slice(0, start),
						files
						.map((file) => {
							return `import '${file}';`;
						})
						.join('\n'),
						source.slice(end),
					].join('');
				}
				return source;
			}
		}
	};
}

module.exports = globImport;
