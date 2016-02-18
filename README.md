Indian Ocean
============

[![Build Status](https://secure.travis-ci.org/mhkeller/indian-ocean.png?branch=master&style=flat-square)](http://travis-ci.org/mhkeller/indian-ocean) [![NPM version](https://badge.fury.io/js/indian-ocean.png?style=flat)](http://badge.fury.io/js/indian-ocean) [![npm](https://img.shields.io/npm/dm/indian-ocean.svg)](https://www.npmjs.com/package/indian-ocean)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

A library for reading in and writing out data in Node.js, part of [The TK Toolkit](https://github.com/mhkeller/tktk).

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
npm install indian-ocean
````

Documentation
-------------

See the full [API docs](http://mhkeller.github.io/indian-ocean/docs/).

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
    "occupation": "Teacher",
    "city": "Philadelphia"
  },
  {
    "name": "Marcy",
    "occupation": "Venture Capitalist",
    "city": "New York"
  }
]
*/

io.writeDataSync('path/to/save/output.json', json_data)
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
      "occupation": "Teacher",
      "city": "Philadelphia"
    },
    {
      "name": "Marcy",
      "occupation": "Venture Capitalist",
      "city": "New York"
    }
  ],
  [
    {
      "name": "Liza",
      "occupation": "Principle",
      "city": "Philadelphia"
    },
    {
      "name": "Eileen",
      "occupation": "CEO",
      "city": "New York"
    }
  ]
]
*/
```

License
-------

MIT 
