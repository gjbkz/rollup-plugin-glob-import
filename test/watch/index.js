const path = require('path');
const fs = require('fs');
const console = require('console');
const rollup = require('rollup');
const test = require('@nlib/test');
const cp = require('@nlib/cp');
const rm = require('@nlib/rm');
const {runInNewContext} = require('vm');
const promisify = require('@nlib/promisify');
const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const appendFile = promisify(fs.appendFile);
const stat = promisify(fs.stat);
const globImport = require('../..');
test('watch', (test) => {
	const projects = [];
	test('get projects', () => {
		return readdir(__dirname)
		.then((names) => {
			return Promise.all(names.map((name) => {
				return stat(path.join(__dirname, name))
				.then((stats) => {
					if (stats.isDirectory()) {
						projects.push(name);
					}
				});
			}));
		});
	});
	test('test projects', (test) => {
		for (const name of projects) {
			test(name, (test) => {
				const directory = path.join(__dirname, name);
				for (const options of require(`./${name}/options.js`)) {
					test(`options: ${JSON.stringify(options)}`, (test) => {
						const results = {};
						const tempDirectory = path.join(directory, 'temp');
						const input = path.join(tempDirectory, 'src', 'index.js');
						const dest = path.join(tempDirectory, 'output.js');
						test('rm', () => {
							return rm(tempDirectory);
						});
						test('cp', () => {
							return cp(directory, tempDirectory);
						});
						test('bundle', () => {
							return new Promise((resolve, reject) => {
								let count = 0;
								results.watcher = rollup.watch({
									input,
									plugins: [globImport(options)],
									output: {
										file: dest,
										format: 'es',
									},
								})
								.on('event', (event) => {
									console.log(`#${count} ${event.code}`);
									switch (event.code) {
									case 'END':
										if (0 < count) {
											resolve();
										} else {
											count++;
											appendFile(input, '\n').catch(reject);
										}
										break;
									case 'FATAL':
									case 'ERROR':
										reject(event.error);
										break;
									default:
									}
								});
							});
						}, {timeout: 4000});
						test('read the code', () => {
							return readFile(dest, 'utf8')
							.then((code) => {
								results.code = code;
							});
						});
						test('run the code', () => {
							results.context = {};
							runInNewContext(results.code, results.context);
						});
						test('check the result', (test) => {
							test.object(results.context.result, require(`./${name}/expected`));
						});
						test('close', () => {
							if (results.watcher) {
								results.watcher.close();
							}
						});
					});
				}
			});
		}
	});
});
