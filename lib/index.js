const path = require('path');
const fs = require('fs');
const {promisify} = require('util');
const {createFilter} = require('rollup-pluginutils');
const readFile = promisify(fs.readFile);
const glob = promisify(require('glob'));
const camelCase = (input) => input.replace(/[-+*/:;.'"`?!&~|<>^%#=@[\]{}()\s\\]+([a-z]|$)/g, (_match, c) => c.toUpperCase());
const defaultRenamer = (name, id) => name || camelCase(path.basename(id, path.extname(id)));
const IntermediateFileFormat = {
    import: 'import',
    named: 'named',
    default: 'default',
    mixed: 'mixed',
};

const codeGenerator = {
    [IntermediateFileFormat.default](files, importer, options) {
        const lines = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const id = path.join(path.dirname(importer), file);
            const exported = options.rename(null, id);
            if (exported) {
                lines.push(
                    `import _${i} from ${JSON.stringify(file)};`,
                    `export {_${i} as ${exported}};`,
                );
            }
        }
        return lines.join('\n');
    },
    [IntermediateFileFormat.named](files) {
        return files.map((file) => `export * from ${JSON.stringify(file)};`).join('\n');
    },
    [IntermediateFileFormat.import](files) {
        return files.map((file) => `import ${JSON.stringify(file)};`).join('\n');
    },
    async [IntermediateFileFormat.mixed](files, importer, options) {
        const acornOptions = Object.assign({sourceType: 'module'}, options.acorn);
        const lines = await Promise.all(files.map(async (file, index) => {
            const id = path.join(path.dirname(importer), file);
            const code = await readFile(id, 'utf8');
            const lines = [];
            const namedExports = [];
            for (const node of this.parse(code, acornOptions).body) {
                const {type} = node;
                if (type === 'ExportAllDeclaration') {
                    let from = node.source.value;
                    if (from.startsWith('.')) {
                        from = `./${path.join(path.dirname(file), from).split(path.sep).join('/')}`;
                    }
                    lines.push(`export * from ${JSON.stringify(from)};`);
                } else if (type === 'ExportDefaultDeclaration') {
                    const exported = options.rename(null, id);
                    if (exported) {
                        lines.push(`import _${index} from ${JSON.stringify(file)};`);
                        lines.push(`export {_${index} as ${exported}};`);
                    }
                } else if (type === 'ExportNamedDeclaration') {
                    for (const specifier of node.specifiers) {
                        namedExports.push(specifier.exported.name);
                    }
                    if (node.declaration) {
                        for (const declaration of node.declaration.declarations || [node.declaration]) {
                            namedExports.push(declaration.id.name);
                        }
                    }
                }
            }
            const nameMapping = [];
            for (const name of namedExports) {
                const exported = options.rename(name, id);
                if (exported) {
                    nameMapping.push(`${name} as ${exported}`);
                }
            }
            if (0 < nameMapping.length) {
                lines.push(`export {${nameMapping.join(', ')}} from ${JSON.stringify(file)}`);
            }
            if (lines.length === 0) {
                lines.push(`import ${JSON.stringify(file)};`);
            }
            return lines.join('\n');
        }));
        return lines.join('\n');
    },
};

const plugin = (options = {}) => {
    options = Object.assign({format: IntermediateFileFormat.mixed}, options);
    if (options.rename && options.format !== IntermediateFileFormat.default) {
        options.format = IntermediateFileFormat.mixed;
    }
    options.rename = options.rename || defaultRenamer;
    const generateCode = codeGenerator[options.format];
    if (!generateCode) {
        throw new Error(`InvalidFormat: ${options.format}`);
    }
    const filter = createFilter(options.include, options.exclude);
    const generatedCodes = new Map();
    return {
        name: 'glob-import',
        async resolveId(importee, importer) {
            if (!filter(importer) || !importee.includes('*')) {
                return null;
            }
            const importerDirectory = path.dirname(importer);
            let files = await glob(importee, {cwd: importerDirectory});
            if (options.intercept) {
                files = options.intercept(files.slice(), importee, importer);
            }
            const code = await generateCode.call(this, files, importer, options);
            const tempPath = path.join(importerDirectory, importee.replace(/\W/g, (c) => `_${c.codePointAt(0)}_`));
            generatedCodes.set(tempPath, code);
            return tempPath;
        },
        load(id) {
            return generatedCodes.get(id);
        },
    };
};

module.exports = Object.assign(
    plugin,
    {
        plugin,
        defaultRenamer,
        camelCase,
        IntermediateFileFormat,
    },
);
