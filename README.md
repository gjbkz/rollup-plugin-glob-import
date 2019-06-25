# rollup-plugin-glob-import

[![Build Status](https://travis-ci.org/kei-ito/rollup-plugin-glob-import.svg?branch=master)](https://travis-ci.org/kei-ito/rollup-plugin-glob-import)
[![CircleCI](https://circleci.com/gh/kei-ito/rollup-plugin-glob-import/tree/master.svg?style=svg)](https://circleci.com/gh/kei-ito/rollup-plugin-glob-import/tree/master)
[![codecov](https://codecov.io/gh/kei-ito/rollup-plugin-glob-import/branch/master/graph/badge.svg)](https://codecov.io/gh/kei-ito/rollup-plugin-glob-import)

A plugin to use glob-star.

## Installation

```bash
npm install --save-dev rollup-plugin-glob-import
```

## Usage

```javascript
// rollup.config.js
const globImport = require('rollup-plugin-glob-import');
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

- `options.include` and `options.exclude` are passed to [`rollup-pluginutils.createfilter`](https://github.com/rollup/rollup-pluginutils#createfilter).
- `options.format` specifies the format of intermediate files.
  The default value is `mixed`. Select others to skip [acorn](https://www.npmjs.com/package/acorn) parsing.
  Examples are based on:
  ```js
  // index.js
  import * as foos from './foo/**/*.js';
  
  // ./foo/bar.js
  window.sideEffect = 'bar was here';
  export default 0;
  export let a = 'a';
  export let b = 42;
  ```
  - `"import"`:
  Import files for side effect only.
  ```js
  import './foo/bar.js';
  ```
  - `"named"`:
  The intermediate files export only **named** exports.
  ```js
  export * from './foo/bar.js';
  ```
  - `"default"`:
  The intermediate files export only **default** exports.
  ```js
  import __bar from './foo/bar.js';
  export {__bar as {{rename(null, '/src/foo/bar.js')}} };
  ```
  - `"mixed"`:
  This plugin read the imported files and parse it with [acorn](https://www.npmjs.com/package/acorn) to check default exports.
  Intermediate files export both named exports and default exports.
  ```js
  import __bar from './foo/bar.js';
  export {__bar as {{rename(null, '/src/foo/bar.js')}} };
  import { a, b } from './foo/bar.js';
  export { a as {{rename('a', '/src/foo/bar.js')}}, b as {{rename('b', '/src/foo/bar.js')}} };
  ```
  - `"all"`:
  Will have an export for each file by filename, containing `*` in that file.
  ```js
  import * as __bar from './foo/bar.js';
  export {__bar as {{rename(null, '/src/foo/bar.js')}} };
  ```
  - `"bypath"`:
  Default export is an object with the path as the key, and `*` in the file as the value.
  ```js
  import * as __bar from './foo/bar.js';
  export default { {{rename('./foo/bar.js', '/src/foo/bar.js')}}: __bar };
  ```
- `options.rename` is a function(*name*, *id*) → *identifier* to determine the name of exports.
  It is used if `options.format` is `"mixed"`, `"default"`, `"all"` or `"bypath"`.
  For example, if an imported module `/src/foo.js` has `export const bar = 123` and `export default 456`,
  it is called twice: rename('bar', '/src/foo.js'), rename(null, '/src/foo.js').
  Exports that the `rename()` returns falsy value are ignored.
- `options.acorn` is passed to [acorn](https://www.npmjs.com/package/acorn).
  Only used if format is `"mixed"`. The default value is `{sourceType: "module"}`.
- `options.intercept` is a function(*sources*, *importer*, *importee*) → *new_sources*.
  It is called before generating intermediate files.
  Therefore you can add or remove items from *sources*.

## License

MIT
