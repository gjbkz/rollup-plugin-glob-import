require('regenerator-runtime/runtime');
'use strict';

var test = function () {
	var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(run) {
		var _this = this;

		var assert, path, vm, _require, rollup, globImport, toURLString, input, params;

		return regeneratorRuntime.wrap(function _callee6$(_context6) {
			while (1) {
				switch (_context6.prev = _context6.next) {
					case 0:
						assert = require('assert');
						path = require('path');
						vm = require('vm');
						_require = require('rollup'), rollup = _require.rollup;
						globImport = require('../..');
						toURLString = require('../../toURLString');
						input = path.join(__dirname, 'src', 'index.js');
						params = {};
						_context6.next = 10;
						return run('bundle', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
							return regeneratorRuntime.wrap(function _callee$(_context) {
								while (1) {
									switch (_context.prev = _context.next) {
										case 0:
											_context.t0 = rollup;
											_context.t1 = input;
											_context.t2 = {
												transform(source, id) {
													return source.split('__dirname').join(toURLString(path.dirname(id)));
												}
											};
											_context.t3 = globImport({ debug: true });
											_context.t4 = {
												transform(source, id) {
													if (id.includes('_deps1_-star-_js.js')) {
														params.deps1 = source;
													}
													if (id.includes('_deps2_-star-_js.js')) {
														params.deps2 = source;
													}
												}
											};
											_context.t5 = [_context.t2, _context.t3, _context.t4];
											_context.t6 = {
												input: _context.t1,
												plugins: _context.t5
											};
											_context.next = 9;
											return (0, _context.t0)(_context.t6);

										case 9:
											params.bundle = _context.sent;

										case 10:
										case 'end':
											return _context.stop();
									}
								}
							}, _callee, _this);
						})));

					case 10:
						_context6.next = 12;
						return run('check relative glob pattern', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
							return regeneratorRuntime.wrap(function _callee2$(_context2) {
								while (1) {
									switch (_context2.prev = _context2.next) {
										case 0:
											assert.equal(params.deps1.trim(), [`import './deps1/a.js';`, `import './deps1/b.js';`].join('\n'));

										case 1:
										case 'end':
											return _context2.stop();
									}
								}
							}, _callee2, _this);
						})));

					case 12:
						_context6.next = 14;
						return run('check absolute glob pattern', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
							return regeneratorRuntime.wrap(function _callee3$(_context3) {
								while (1) {
									switch (_context3.prev = _context3.next) {
										case 0:
											assert.equal(params.deps2.trim(), [`import '${toURLString(__dirname)}/src/deps2/c.js';`, `import '${toURLString(__dirname)}/src/deps2/d.js';`].join('\n'));

										case 1:
										case 'end':
											return _context3.stop();
									}
								}
							}, _callee3, _this);
						})));

					case 14:
						_context6.next = 16;
						return run('generate code', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
							return regeneratorRuntime.wrap(function _callee4$(_context4) {
								while (1) {
									switch (_context4.prev = _context4.next) {
										case 0:
											_context4.next = 2;
											return params.bundle.generate({ format: 'es' });

										case 2:
											params.code = _context4.sent.code;

										case 3:
										case 'end':
											return _context4.stop();
									}
								}
							}, _callee4, _this);
						})));

					case 16:
						_context6.next = 18;
						return run('run code', function () {
							params.result = {};
							vm.runInNewContext(params.code, { result: params.result });
						});

					case 18:
						_context6.next = 20;
						return run('test the result', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
							var expected;
							return regeneratorRuntime.wrap(function _callee5$(_context5) {
								while (1) {
									switch (_context5.prev = _context5.next) {
										case 0:
											expected = {
												a: 'a',
												b: 'b',
												c: 'c',
												d: 'd'
											};

											assert.deepEqual(params.result, expected);

										case 2:
										case 'end':
											return _context5.stop();
									}
								}
							}, _callee5, _this);
						})));

					case 20:
					case 'end':
						return _context6.stop();
				}
			}
		}, _callee6, this);
	}));

	return function test(_x) {
		return _ref.apply(this, arguments);
	};
}();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

module.exports = test;