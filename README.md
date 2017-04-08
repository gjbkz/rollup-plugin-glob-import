# rollup-plugin-glob-import

[![Build Status](https://travis-ci.org/kei-ito/rollup-plugin-glob-import.svg?branch=master)](https://travis-ci.org/kei-ito/rollup-plugin-glob-import)
[![Code Climate](https://codeclimate.com/github/kei-ito/rollup-plugin-glob-import/badges/gpa.svg)](https://codeclimate.com/github/kei-ito/rollup-plugin-glob-import)
[![Test Coverage](https://codeclimate.com/github/kei-ito/rollup-plugin-glob-import/badges/coverage.svg)](https://codeclimate.com/github/kei-ito/rollup-plugin-glob-import/coverage)
[![dependencies Status](https://david-dm.org/kei-ito/rollup-plugin-glob-import/status.svg)](https://david-dm.org/kei-ito/rollup-plugin-glob-import)

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
  entry: 'path/to/src',
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

Suppose you have the following files and directories.

- `src.js`
- scripts
    - `001.js`
    - `002.js`
    - `003.js`

Where the `src.js` contains the following import.

```javascript
import './scripts/*.js';
```

This plugin converts the import to following imports.

```javascript
import './scripts/001.js';
import './scripts/002.js';
import './scripts/003.js';
```

Note: Use `import A`, not `import X from Y`.
