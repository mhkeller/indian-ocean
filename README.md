Indian Ocean
============

[![Build Status](https://secure.travis-ci.org/mhkeller/indian-ocean.png?branch=master&style=flat-square)](http://travis-ci.org/mhkeller/indian-ocean) [![NPM version](https://badge.fury.io/js/indian-ocean.png?style=flat)](http://badge.fury.io/js/indian-ocean) [![npm](https://img.shields.io/npm/dm/indian-ocean.svg)](https://www.npmjs.com/package/indian-ocean)

A library for reading in and writing out data in Node.js, part of [The TK Toolkit](https://github.com/mhkeller/tktk).

Installation
------------

````
npm install indian-ocean
````

Documentation
-------------

See the full [API docs](http://mhkeller.github.io/indian-ocean/docs/).

[![js-standard-style](https://raw.githubusercontent.com/feross/standard/master/badge.png)](https://github.com/feross/standard)


Usage
-----

````js
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
````

License
-------

MIT 
