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
    const global = {};
    sandbox.g = global;
    sandbox.global = global;
    runInNewContext(code, sandbox);
    return global;
};
