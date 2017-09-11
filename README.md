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
import '/absolute/path/to/deps2/*.js';
```

The lines in `index.js` works as a code below.

```javascript
import './deps1/a.js';
import './deps1/b.js';
import '/absolute/path/to/deps2/c.js';
import '/absolute/path/to/deps2/d.js';
```

Note: Use `import A`, not `import X from Y`.
