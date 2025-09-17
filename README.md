# Deprecated: rollup-plugin-glob-import

A plugin to use glob-star in import source.

This library has been archived and is no longer maintained.

## Rationale
1. **Lack of TypeScript support**  
   This plugin does not provide proper support for TypeScript declaration generation or type safety.  
   In the TypeScript era, using glob imports without type guarantees is not recommended.

2. **Preferred design direction**  
   Instead of using `import "./path/*.ts"` with glob-star,  
   we recommend **generating an `index.ts` file from the glob results** and re-exporting modules explicitly.  
   This approach works better with IDEs and type checking.

## Suggested alternatives
- If you are using Vite, consider [`import.meta.glob`](https://vitejs.dev/guide/features.html#glob-import).  
- For Rollup or other bundlers, generating an `index.ts` barrel file at build time is the preferred approach.

Thank you for using this plugin until now.

```javascript
import foo from './path/to/lib/*.js';
```

## Installation

```bash
npm install --save-dev rollup-plugin-glob-import
```

## Usage

```javascript
// rollup.config.js
const globImport = require('rollup-plugin-glob-import');
// import {plugin as globImport} from 'rollup-plugin-glob-import';
export default {
  input: 'path/to/input.js',
  plugins: [
    globImport(options) // See the "Options" section below.
  ]
}
```

## Example

- [sample/001](sample/001): Import named exports
- [sample/002](sample/002): Import all exports including default exports
- [sample/003](sample/003): Import side effects
- [sample/004](sample/004): Use options.rename

## Options

```typescript
export interface IGlobPluginOptions {
    /**
     * The first argument of [rollup-pluginutils.createfilter](https://github.com/rollup/rollup-pluginutils#createfilter).
     */
    include?: Parameters<CreateFilter>[0],
    /**
     * The second argument of [rollup-pluginutils.createfilter](https://github.com/rollup/rollup-pluginutils#createfilter).
     */
    exclude?: Parameters<CreateFilter>[0],
    /**
     * - `'import'`: The intermediate files work as importer that export nothing.
     * - `'named'`: The intermediate files export only **named** exports.
     * - `'default'`: The intermediate files export only **default** exports.
     * - `'mixed'`: This plugin read the imported files and parse it with
     *   [acorn](https://www.npmjs.com/package/acorn) to check default exports.
     *   Intermediate files export both named exports and default exports.
     */
    format?: IntermediateFileFormat,
    /**
     * A function generates the name of exports.
     * It is used if `options.format` is `'mixed'` or `'default'`.
     * For example, if an imported module `/src/foo.js` has
     * `export const bar = 123` and `export default 456`, it is called twice:
     * `rename('bar', '/src/foo.js')`, `rename(null, '/src/foo.js')`.
     * If a return values is falsy value, it is ignored.
     */
    rename?: (name: string, id: string) => string,
    /**
     * [acorn](https://www.npmjs.com/package/acorn) options.
     * The default value is `{sourceType: 'module'}`.
     */
    acorn?: acorn.Options,
    /**
     * A function called before generating intermediate files.
     * You can add or remove files from sources.
     */
    intercept?: (sources: Array<string>, importer: string, importee: string) => Array<string>,
}
```

https://github.com/kei-ito/rollup-plugin-glob-import/blob/d5d6d22d322da92ca8026322b2d629689fd8496d/lib/index.d.ts#L12-L49

## License

MIT
