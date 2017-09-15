require('regenerator-runtime/runtime');
'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var path = require('path');

var _require = require('util'),
    promisify = _require.promisify;

var _require2 = require('rollup-pluginutils'),
    createFilter = _require2.createFilter;

var glob = promisify(require('glob'));
var toURLString = require('./toURLString');

function getPseudoFileName(importee) {
	return `${importee.replace(/\*/g, '-star-').replace(/[^\w-]/g, '_')}.js`;
}

function globImport() {
	var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
	    include = _ref.include,
	    exclude = _ref.exclude;

	var filter = createFilter(include, exclude);
	var generatedCodes = new Map();
	return {
		name: 'glob-import',
		resolveId(importee, importer) {
			var _this = this;

			return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
				var importeeIsAbsolute, importerDirectory, foundFiles, code, pseudoPath;
				return regeneratorRuntime.wrap(function _callee$(_context) {
					while (1) {
						switch (_context.prev = _context.next) {
							case 0:
								if (!(!filter(importee) || !importee.includes('*'))) {
									_context.next = 2;
									break;
								}

								return _context.abrupt('return', null);

							case 2:
								importeeIsAbsolute = path.isAbsolute(importee);
								importerDirectory = path.dirname(importer);
								_context.next = 6;
								return glob(importeeIsAbsolute ? importee : path.join(importerDirectory, importee));

							case 6:
								foundFiles = _context.sent;
								code = foundFiles.map(importeeIsAbsolute ? function (file) {
									return `import '${toURLString(file)}';`;
								} : function (file) {
									return `import '${toURLString(path.relative(importerDirectory, file))}';`;
								}).join('\n');
								pseudoPath = path.join(importerDirectory, getPseudoFileName(importee));

								generatedCodes.set(pseudoPath, code);
								return _context.abrupt('return', pseudoPath);

							case 11:
							case 'end':
								return _context.stop();
						}
					}
				}, _callee, _this);
			}))();
		},
		load(id) {
			if (generatedCodes.has(id)) {
				var code = generatedCodes.get(id);
				generatedCodes.delete(id);
				return code;
			}
		}
	};
}

module.exports = globImport;