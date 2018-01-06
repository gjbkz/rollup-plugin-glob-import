# rollup-plugin-glob-import

[![Build Status](https://travis-ci.org/kei-ito/rollup-plugin-glob-import.svg?branch=master)](https://travis-ci.org/kei-ito/rollup-plugin-glob-import)
[![Build status](https://ci.appveyor.com/api/projects/status/github/kei-ito/rollup-plugin-glob-import?branch=master&svg=true)](https://ci.appveyor.com/project/kei-ito/rollup-plugin-glob-import/branch/master)
[![codecov](https://codecov.io/gh/kei-ito/rollup-plugin-glob-import/branch/master/graph/badge.svg)](https://codecov.io/gh/kei-ito/rollup-plugin-glob-import)
[![dependencies Status](https://david-dm.org/kei-ito/rollup-plugin-glob-import/status.svg)](https://david-dm.org/kei-ito/rollup-plugin-glob-import)
[![devDependencies Status](https://david-dm.org/kei-ito/rollup-plugin-glob-import/dev-status.svg)](https://david-dm.org/kei-ito/rollup-plugin-glob-import?type=dev)

A plugin to use glob-star.

## Installation

```bash
npm install --save-dev rollup-plugin-glob-import
```

## Usage

```javascript
const {rollup} = require('rollup');
const globImport = require('rollup-plugin-glob-import');

return rollup({
  input: 'path/to/input.js',
  plugins: [
    globImport(options) // See the "Options" section below.
  ]
})
.then((bundle) => {
  const {code} = bundle.generate({format: 'es'});
  fs.writeFileSync('path/to/dest', code);
});
```

## Example

Suppose you have the following files.

- `deps1/a.js`
- `deps1/b.js`
- `deps2/c.js`
- `deps2/d.js`
- `index.js`

```javascript
// index.js
import './deps1/*.js';
import * as foo from './deps2/*.js';

// a.js
export const aa = 'aa';

// b.js
export const bb = 'bb';
export default 'b';

// c.js
export const cc = 'cc';

// d.js
export const dd = 'dd';
export default 'd';
```

This plugin creates intermediate files if the module name includes "*".

```javascript
// intermediate file for './deps1/*.js'
export * from './deps1/a.js';
export * from './deps1/b.js';
import _0 from './deps1/b.js';
export {_0 as b};

// intermediate file for './deps2/*.js'
export * from './deps2/c.js';
export * from './deps2/d.js';
import _0 from './deps2/d.js';
export {_0 as d};
```

## Options

- `options.include` and `options.exclude` are passed to [`rollup-pluginutils.createfilter`](https://github.com/rollup/rollup-pluginutils#createfilter).
- `options.format` specifies the format of intermediate files.
  The default value is `mixed`. Select others to skip [acorn](https://www.npmjs.com/package/acorn) parsing.
  - `named`:
  The intermediate files export only **named** exports.
  - `default`:
  The intermediate files export only **default** exports.
  - `mixed`:
  This plugin read the imported files and parse it with [acorn](https://www.npmjs.com/package/acorn) to check default exports.
  Intermediate files export both named exports and default exports.
- `options.acorn` is passed to [acorn](https://www.npmjs.com/package/acorn). It is used if `options.format` is 'mixed'. The default value is `{sourceType: 'module'}`.
- `options.defaultExport` is a function(*file*) → *identifier* to determine the name of default exports. It is used if `options.format` is 'mixed' or 'default'. The default value is a function extracts basename of file and coverts it to the camelCase style ([src/index.js](https://github.com/kei-ito/rollup-plugin-glob-import/blob/master/src/index.js#L10)).


## License

MIT
