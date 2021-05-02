const path = require('path');
const {promises: afs} = require('fs');
const {runInNewContext} = require('vm');
const console = require('console');

exports.runCode = (code, sandbox = {}) => {
    sandbox = {
        console,
        amd: {
            defined: new Map(),
            loaded: new Map(),
        },
        define: (id, dependencies, factory) => {
            if (typeof id !== 'string') {
                factory = dependencies;
                dependencies = id;
                id = '';
            }
            if (!Array.isArray(dependencies)) {
                factory = dependencies;
                dependencies = [];
            }
            factory();
        },
        ...sandbox,
    };
    sandbox.g = sandbox;
    sandbox.global = sandbox;
    runInNewContext(code, sandbox);
    return {...sandbox};
};

/**
 * @param {string} file
 */
const remove = async (file) => {
    const stats = await afs.stat(file);
    if (stats.isDirectory()) {
        for (const name of await afs.readdir(file)) {
            await remove(path.join(file, name));
        }
        await afs.rmdir(file);
    } else {
        await afs.unlink(file);
    }
};

/**
 * @param {string} directory
 */
exports.clearDirectory = async (directory) => {
    try {
        for (const name of await afs.readdir(directory)) {
            await remove(path.join(directory, name));
        }
    } catch (error) {
        if (error && error.code === 'ENOENT') {
            await afs.mkdir(directory);
        }
    }
};
