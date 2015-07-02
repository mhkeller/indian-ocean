Indian Ocean
============

A library for reading in and writing out data in Node.js, part of [The TK Toolkit](https://github.com/mhkeller/tktk).

# Installation

````
npm install indian-ocean
````

# Usage

````js
var io = require('indian-ocean');

var json_data = io.readDataSync('path/to/data.csv');

console.log(json_data);

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

There are more details in the [API
documentation](http://mhkeller.github.io/indian-ocean/docs/).

# License

MIT 
