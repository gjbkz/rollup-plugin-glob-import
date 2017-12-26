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
    globImport()
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
```

This plugin creates intermediate files if the module name includes "*".

```javascript
// intermediate file for './deps1/*.js'
export * from './deps1/a.js';
export * from './deps1/b.js';
```

```javascript
// intermediate file for './deps2/*.js'
export * from './deps2/c.js';
export * from './deps2/d.js';
```

## License

MIT
