Indian Ocean
============

[![Travis (.org) branch](https://img.shields.io/travis/mhkeller/indian-ocean/master.svg?style=flat-square)](https://travis-ci.org/mhkeller/indian-ocean) [![npm version](https://img.shields.io/npm/v/indian-ocean.svg?style=flat-square)](https://npmjs.org/package/indian-ocean) [![npm](https://img.shields.io/npm/dm/indian-ocean.svg?style=flat-square)](https://www.npmjs.com/package/indian-ocean)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/feross/standard)

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

io.writeDataSync('path/to/save/output.json', json_data, { indent: 2 })
```

Or, combine methods to read in a directory of csvs as json:

```js
var io = require('indian-ocean')

// Let's say this directory contains two csvs, each with two rows like the above example
var csvs = io.readdirFilterSync('csvs-folder', { include: 'csv', fullPath: true }).map(io.readDataSync)

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

// Concatenate them into one file with Javascript's Array.flat() method and write out one combined csv
io.writeDataSync('single-file.csv', csvs.flat())

/*
name,city
Gerald,Los Angeles
Marcy,Tuscaloosa
Liza,Minneapolis
Eileen,Mobile
*/
```

License
-------

MIT
