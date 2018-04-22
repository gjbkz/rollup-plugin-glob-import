# rollup-plugin-glob-import

[![Greenkeeper badge](https://badges.greenkeeper.io/kei-ito/rollup-plugin-glob-import.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/kei-ito/rollup-plugin-glob-import.svg?branch=master)](https://travis-ci.org/kei-ito/rollup-plugin-glob-import)
[![Build status](https://ci.appveyor.com/api/projects/status/github/kei-ito/rollup-plugin-glob-import?branch=master&svg=true)](https://ci.appveyor.com/project/kei-ito/rollup-plugin-glob-import/branch/master)
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

## Options

- `options.include` and `options.exclude` are passed to [`rollup-pluginutils.createfilter`](https://github.com/rollup/rollup-pluginutils#createfilter).
- `options.format` specifies the format of intermediate files.
  The default value is `mixed`. Select others to skip [acorn](https://www.npmjs.com/package/acorn) parsing.
  - `"import"`:
  The intermediate files work as importer that export nothing.
  - `"named"`:
  The intermediate files export only **named** exports.
  - `"default"`:
  The intermediate files export only **default** exports.
  - `"mixed"`:
  This plugin read the imported files and parse it with [acorn](https://www.npmjs.com/package/acorn) to check default exports.
  Intermediate files export both named exports and default exports.
- `options.acorn` is passed to [acorn](https://www.npmjs.com/package/acorn). It is used if `options.format` is `"mixed"`. The default value is `{sourceType: "module"}`.
- `options.defaultExport` is a function(*file*) → *identifier* to determine the name of default exports. It is used if `options.format` is `"mixed"` or `"default"`. The default value is a function extracts basename of file and coverts it to the camelCase style ([src/index.js](https://github.com/kei-ito/rollup-plugin-glob-import/blob/master/src/index.js#L10)).


## License

MIT
