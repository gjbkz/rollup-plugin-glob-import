import * as rollup from 'rollup';
import * as acorn from 'acorn';
import {CreateFilter} from 'rollup-pluginutils';

export const IntermediateFileFormat: {
    import: 'import',
    named: 'named',
    default: 'default',
    mixed: 'mixed',
};

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
    format?: keyof typeof IntermediateFileFormat,
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

export const plugin: (options: IGlobPluginOptions) => rollup.Plugin;
export const defaultRenamer: (name: string, id: string) => string;
export const camelCase: (input: string) => string;
export default plugin;
