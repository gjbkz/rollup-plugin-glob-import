# rollup-plugin-glob-import

[![Build Status](https://travis-ci.org/kei-ito/rollup-plugin-glob-import.svg?branch=master)](https://travis-ci.org/kei-ito/rollup-plugin-glob-import)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/b1a12f6323344567bf18e1c5aa833fea)](https://www.codacy.com/app/kei.itof/rollup-plugin-glob-import?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=kei-ito/rollup-plugin-glob-import&amp;utm_campaign=Badge_Grade)
[![Codacy Badge](https://api.codacy.com/project/badge/Coverage/b1a12f6323344567bf18e1c5aa833fea)](https://www.codacy.com/app/kei.itof/rollup-plugin-glob-import?utm_source=github.com&utm_medium=referral&utm_content=kei-ito/rollup-plugin-glob-import&utm_campaign=Badge_Coverage)
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
