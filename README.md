Indian Ocean
============

[![Travis (.org) branch](https://img.shields.io/travis/mhkeller/indian-ocean/master.svg)](https://travis-ci.org/mhkeller/indian-ocean) [![npm version](https://img.shields.io/npm/v/indian-ocean.svg)](https://npmjs.org/package/indian-ocean) [![npm](https://img.shields.io/npm/dm/indian-ocean.svg)](https://www.npmjs.com/package/indian-ocean)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

A Node.js library for reading in and writing out data plus some other useful filesystem functions.

Documentation
-------------

### See the full [API docs](http://mhkeller.github.io/indian-ocean/docs/).

Currently supports:

* `csv`
* `tsv`
* `psv`
* `text`
* `json`
* `yaml`
* `dbf`
* `aml` - [ArchieML](http://archieml.org/)
* Custom delimeters

**Plus** a number of file system convenience functions.

Installation
------------

````
npm install --save indian-ocean
````

Usage
-----

```js
var io = require('indian-ocean')

var json_data = io.readDataSync('path/to/data.csv')

console.log(json_data)

/*
[
  {
    "name": "Gerald",
    "city": "Los Angeles"
  },
  {
    "name": "Marcy",
    "city": "Tuscaloosa"
  }
]
*/

io.writeDataSync('path/to/save/output.json', json_data, {indent: 2})
```

Or, combine methods to read in a directory of csvs as json:

```js
var io = require('indian-ocean')

// Let's say this directory contains two csvs, each with two rows like the above example
var csvs = io.readdirFilterSync('csvs-folder', {include: 'csv', fullPath: true}).map(io.readDataSync)

console.log(csvs)

/*
[
  [
    {
      "name": "Gerald",
      "city": "Los Angeles"
    },
    {
      "name": "Marcy",
      "city": "Tuscaloosa"
    }
  ],
  [
    {
      "name": "Liza",
      "city": "Minneapolis"
    },
    {
      "name": "Eileen",
      "city": "Mobile"
    }
  ]
]
*/
```

A word on supported Node versions
-----

All of the tests pass for the versions listed in [`.travis.yml`](.travis.yml). In addition, everything except dbf-related functions *should* work under NodeJS versions 0.11 through 2.x. If you would like dbf support for those versions, the [2.0 releases of Indian Ocean](https://github.com/mhkeller/indian-ocean/releases/tag/v2.0.3) have that support. Install with `npm install --save indian-ocean@2.0.3`.

License
-------

MIT
