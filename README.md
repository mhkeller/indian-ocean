Indian Ocean
============


## Reading data

### .readData(filepath, [delimiter], callback)

Reads in a data file given a path ending in the file format. Callback structure is `function(err, data)`.

Supported formats:

* `.json`
* `.csv` Comma-separated
* `.tsv` Tab-separated
* `.psv` Pipe-separated

Pass in a delimiter as the second argument to read in another format.

### .readDataSync(filepath, [delimiter])

Syncronous version of `.readData()`

### .readJson(filepath, callback)

Read in a json file. Callback structure is `function(err, data)`.

### .readJsonSync(filepath)

Read json syncronously.

### .readCsv(filepath, callback)

Read in a comma-separated value file. Callback structure is `function(err, data)`.

### .readCsvSync(filepath)

Read csv syncronously.

### .readTsv(filepath, callback)

Read in a tab-separated value file. Callback structure is `function(err, data)`.

### .readTsvSync(filepath)

Read tsv syncronously.

### .readPsv(filepath, callback)

Read in a pipe-separated value file. Callback structure is `function(err, data)`.

### .readPsvSync(filepath)

Read psv syncronously.

## Writing data

### .writeData(filepath, data, callback)

Write out the data object, inferring the file format from the file ending specified in `filepath`. Callback structure is `function(err, data)`.

Supported formats:

* `.json`
* `.csv` Comma-separated
* `.tsv` Tab-separated
* `.psv` Pipe-separated

### .writeDataSync(filepath, data)

Syncronous version of `.writeData`. Callback structure is `function(err)`.

## Helpers

### .discernFormat(filepath)

Given a `filepath` return its file extension. Used internally by `.discernPaser` and `.discernFileFormatter`.

E.g. `tk.discernFormat('path/to/data.csv')` returns `'csv'`

### .discernParser(filepath, [delimiter])

Given a `filepath`, optionally a delimiter, return a parser that can read that file as json. Used internally by `.readData` and `.readDataSync`.

E.g. 

````
var csvParser = tk.discernParser('path/to/data.csv');

var json = parser('path/to/data.csv');
````

### .discernFileFormatter(filepath)

Returns a formatter that will format json data to file type specified by the extension in `filepath`. Used internally by `.writeData` and `.writeDataSync`.

E.g.

````
var formatter = tk.discernFileFormatter('path/to/data.tsv');
var csv = formatter(json);
````

# TODO

* Read/write dbf
