var fs = require('fs')
var dsv = require('d3-dsv')
var dbf = require('shapefile/dbf')
var path = require('path')
var queue = require('queue-async')
var _ = require('underscore')

var formatters = {
  json: function (file) {
    return JSON.stringify(file)
  },
  csv: function (file) {
    return dsv.csv.format(file)
  },
  tsv: function (file) {
    return dsv.tsv.format(file)
  },
  psv: function (file) {
    return dsv.dsv('|').format(file)
  }
}

var parsers = {
  json: JSON,
  csv: dsv.csv,
  tsv: dsv.tsv,
  psv: dsv.dsv('|')
}

/** @namespace */
var helpers = {}

/**
 * Given a `fileName` return its file extension. Used internally by `.discernPaser` and `.discernFileFormatter`.
 * @param {String} fileName the name of the file
 * @returns {String} the file's extension
 *
 * @example
 * io.discernFormat('path/to/data.csv') -> 'csv'
 */
helpers.discernFormat = function (fileName) {
  var extension = path.extname(fileName)
  if (extension === '') return false

  var formatName = extension.slice(1)
  // If it ends in json such as `topojson` or `geojson`, call it json.
  if (formatName.substr(formatName.length - 4) === 'json') formatName = 'json'
  return formatName
}

/**
 * Given a `fileName`, optionally a delimiter, return a parser that can read that file as json. Used internally by `.readData` and `.readDataSync`.
 * @param {String} fileName the name of the file
 * @param {String} delimiter optional delimiter
 * @returns {Object} a parser that can read the file
 *
 * @example
 * var parser = io.discernParser('path/to/data.csv');
 * var json = parser('path/to/data.csv');
 */
helpers.discernParser = function (fileName, delimiter) {
  if (delimiter) return dsv.dsv(delimiter)
  var format = helpers.discernFormat(fileName)
  return parsers[format]
}

/**
 * Returns a formatter that will format json data to file type specified by the extension in `fileName`. Used internally by `.writeData` and `.writeDataSync`.
 * @param {String} fileName the name of the file
 * @returns {Object} a formatter that can write the file
 *
 * @example
 * var formatter = io.discernFileFormatter('path/to/data.tsv');
 * var csv = formatter(json);
 */
helpers.discernFileFormatter = function (fileName) {
  var format = helpers.discernFormat(fileName)
  return formatters[format]
}

/**
 * Asynchronously test whether a file exists or not by using `fs.access` modified from https://github.com/nodejs/io.js/issues/1592#issuecomment-98392899.
 * @param {String} fileName the name of the file
 * @param {Function} callback has the signature `(err, exists)`
 *
 * @example
 * var exists = io.exists('path/to/data.tsv', function (err, exists) {
 *   console.log(err) // `false` if the file exists, `true` if not.
 *   console.log(exists) // `true` if the file exists, `false` if not.
 * })
 *
 */
helpers.exists = function (filename, cb) {
  fs.access(function (err) {
    var exists = err ? false : true
    cb(!exists, exists)
  })
}

/**
 * Syncronous version of {@link helpers#exists}
 *
 * @param {String} fileName the name of the file
 * @returns {Boolean} whether the file exists or not
 *
 * @example
 * var exists = io.existsSync('path/to/data.tsv')
 * console.log(exists) // `true` if file exists, `false` if not.
 */
helpers.existsSync = function (filename) {
  try {
    fs.accessSync(filename)
    return true
  } catch(ex) {
    return false
  }
}

/** @namespace */
var readers = {}

/**
 * Asynchronously read data given a path ending in the file format.
 *
 * Supported formats:
 *
 * * `.json` Array of objects
 * * `.csv` Comma-separated
 * * `.tsv` Tab-separated
 * * `.psv` Pipe-separated
 *
 * *Note: Does not currently support .dbf files.*
 *
 * @param {String} fileName the name of the file
 * @param {String} delimiter optional delimiter to use when reading the file
 * @param {Function} callback callback used when read data is read, takes error (if any) and the data read
 */
readers.readData = function (path, delimiter_, cb_) {
  var cb = arguments[arguments.length - 1]
  var delimiter = arguments.length === 3 ? delimiter : false
  fs.readFile(path, 'utf8', function (err, data) {
    cb(err, helpers.discernParser(path, delimiter).parse(data))
  })
}

/**
 * Syncronous version of {@link readers#readData}
 *
 * @param {String} fileName the name of the file
 * @param {String} delimiter optional delimiter to use when reading the file
 * @returns {Object} the contents of the file as JSON
 */
readers.readDataSync = function (path, delimiter) {
  return helpers.discernParser(path, delimiter).parse(fs.readFileSync(path, 'utf8'))
}

/**
 * Asynchronously read a comma-separated value file.
 *
 * @param {String} fileName the name of the file
 * @param {Function} callback callback used when read data is read, takes error (if any) and the data read
 */
readers.readCsv = function (path, cb) {
  fs.readFile(path, 'utf8', function (err, data) {
    cb(err, parsers.csv.parse(data))
  })
}

/**
 * Synchronously read a comma-separated value file.
 *
 * @param {String} fileName the name of the file
 * @returns {Object} the contents of the file as JSON
 */
readers.readCsvSync = function (path) {
  return parsers.csv.parse(fs.readFileSync(path, 'utf8'))
}

/**
 * Asynchronously read a JSON file.
 *
 * @param {String} fileName the name of the file
 * @param {Function} callback callback used when read data is read, takes error (if any) and the data read
 */
readers.readJson = function (path, cb) {
  fs.readFile(path, function (err, data) {
    cb(err, JSON.parse(data))
  })
}

/**
 * Synchronously read a JSON file.
 *
 * @param {String} fileName the name of the file
 * @returns {Object} the contents of the file as JSON
 */
readers.readJsonSync = function (path) {
  return parsers.json.parse(fs.readFileSync(path))
}

/**
 * Asynchronously read a tab-separated value file.
 *
 * @param {String} fileName the name of the file
 * @param {Function} callback callback used when read data is read, takes error (if any) and the data read
 */
readers.readTsv = function (path, cb) {
  fs.readFile(path, 'utf8', function (err, data) {
    cb(err, parsers.tsv.parse(data))
  })
}

/**
 * Synchronously read a tab-separated value file.
 *
 * @param {String} fileName the name of the file
 * @returns {Object} the contents of the file as JSON
 */
readers.readTsvSync = function (path) {
  return parsers.tsv.parse(fs.readFileSync(path, 'utf8'))
}

/**
 * Asynchronously read a pipe-separated value file.
 *
 * @param {String} fileName the name of the file
 * @param {Function} callback callback used when read data is read, takes error (if any) and the data read
 */
readers.readPsv = function (path, cb) {
  fs.readFile(path, 'utf8', function (err, data) {
    cb(err, parsers.psv.parse(data))
  })
}

/**
 * Synchronously read a pipe-separated value file.
 *
 * @param {String} fileName the name of the file
 * @returns {Object} the contents of the file as JSON
 */
readers.readPsvSync = function (path) {
  return parsers.psv.parse(fs.readFileSync(path, 'utf8'))
}

/**
 * Asynchronously read a dbf file.
 *
 * @param {String} fileName the name of the file
 * @param {Function} callback callback used when read data is read, takes error (if any) and the data read
 */
readers.readDbf = function (path, cb) {
  var reader = dbf.reader(path)
  var rows = []
  var headers

  // Run these in order
  queue(1)
    .defer(readHeader)
    .defer(readAllRecords)
    .defer(close)
    .await(function (error, readHeaderData, readAllRecordsData, jsonData) {
      // We're using queue to work through this flow
      // As a result, `readHeaderData`, `readAllRecordsData` are going to be undefined
      // Because they aren't meant to return anything, just process data
      // `rowData`, however contains all our concatenated data, so let's return that
      cb(error, jsonData)
    })

  function readHeader (callback) {
    reader.readHeader(function (error, header) {
      if (error) {
        return callback(error)
      }
      headers = header.fields.map(function (d) {
        return d.name
      })
      callback(null)
    })
  }

  function readAllRecords (callback) {
    (function readRecord () {
      reader.readRecord(function (error, record) {
        if (error) {
          return callback(error)
        }
        if (record === dbf.end) {
          return callback(null)
        }
        var jsonRecord = _.object(headers, record)
        rows.push(jsonRecord)
        process.nextTick(readRecord)
      })
    })()
  }

  function close (callback) {
    reader.close(function (error) {
      if (error) {
        return callback(error)
      }
      callback(null, rows)
    })
  }

}

function extensionMatches (file, extension) {
  // Chop '.' off extension returned by extname
  return path.extname(file).slice(1) === extension
}

/**
 * Get a list of the files in a directory with selected extentions.
 *
 * @param {String} path the directory to read from
 * @param {Array<String>|String} includes the file extention(s) to include
 * @param {Function} callback the callback that will accept the filtered files, takes an optional error and an array of file names
 */
readers.readdirInclude = function (path, includes, cb) {
  if (typeof includes === 'string') {
    includes = [includes]
  }
  fs.readdir(path, function (err, files) {
    var filtered = files.filter(function (file) {
      return _.some(includes, function (includeExtension) { return extensionMatches(file, includeExtension) })
    })
    cb(err, filtered)
  })
}

/**
 * Synchronously get a list of the files in a directory with selected extentions.
 *
 * @param {String} path the directory to read from
 * @param {Array<String>|String} includes the file extention(s) to include
 * @returns {Array<String>} the matching files' paths
 */
readers.readdirIncludeSync = function (path, includes) {
  if (typeof includes === 'string') {
    includes = [includes]
  }
  return fs.readdirSync(path).filter(function (file) {
    return _.some(includes, function (includeExtension) { return extensionMatches(file, includeExtension) })
  })
}

/**
 * Get a list of the files in a directory that do not have the selected extentions.
 *
 * @param {String} path the directory to read from
 * @param {Array<String>|String} includes the file extention(s) to include
 * @param {Function} callback the callback that will accept the filtered files, takes an optional error and an array of file names
 */
readers.readdirExclude = function (path, excludes, cb) {
  if (typeof excludes === 'string') {
    excludes = [excludes]
  }
  fs.readdir(path, function (err, files) {
    var filtered = files.filter(function (file) {
      return _.some(excludes, function (excludeExtension) { return !extensionMatches(file, excludeExtension) })
    })
    cb(err, filtered)
  })
}

/**
 * Synchronously get a list of the files in a directory that do not have the selected extentions.
 *
 * @param {String} path the directory to read from
 * @param {Array<String>|String} includes the file extention(s) to include
 * @returns {Array<String>} the matching files' paths
 */
readers.readdirExcludeSync = function (path, excludes, cb) {
  if (typeof excludes === 'string') {
    excludes = [excludes]
  }
  return fs.readdirSync(path).filter(function (file) {
    return _.some(excludes, function (excludeExtension) { return !extensionMatches(file, excludeExtension) })
  })
}

/** @namespace */
var writers = {}

/**
 * Write the data object, inferring the file format from the file ending specified in `fileName`.
 *
 * Supported formats:
 *
 * * `.json` Array of objects
 * * `.csv` Comma-separated
 * * `.tsv` Tab-separated
 * * `.psv` Pipe-separated
 *
 * *Note: Does not currently support .dbf files.*
 *
 * @param {String} fileName the name of the file
 * @param {Object} data the data to write
 * @param {Function} callback callback that takes an error, if any
 */
writers.writeData = function (path, data, cb) {
  var fileFormatter = helpers.discernFileFormatter(path)
  fs.writeFile(path, fileFormatter(data), function (err) {
    cb(err)
  })
}

/**
 * Syncronous version of {@link writers#writeData}
 *
 * @param {String} fileName the name of the file
 * @param {Object} data the data to write
 */
writers.writeDataSync = function (path, data) {
  var fileFormatter = helpers.discernFileFormatter(path)
  fs.writeFileSync(path, fileFormatter(data))
}

/**
 * Append to an existing data object, creating a new file if one does not exist
 *
 * Supported formats:
 *
 * * `.json` Array of objects
 * * `.csv` Comma-separated
 * * `.tsv` Tab-separated
 * * `.psv` Pipe-separated
 *
 * *Note: Does not currently support .dbf files.*
 *
 * @param {String} fileName the name of the file
 * @param {Object} data the data to write
 * @param {Function} callback callback that takes an error, if any
 */
writers.appendData = function (path, data, cb) {
  // Run append file to delegate creating a new file if none exists
  fs.appendFile(path, '', function (err) {
    if (!err) {
      readers.readData(path, function (err, existingData) {
        if (!err) {
          var fileFormatter = helpers.discernFileFormatter(path)
          data = existingData.concat(data)
          fs.writeFile(path, fileFormatter(data), cb)
        } else {
          cb(err)
        }
      })
    } else {
      cb(err)
    }
  })
}

/**
 * Synchronous version of {@link writers#appendData}
 *
 * @param {String} fileName the name of the file
 * @param {Object} data the data to write
 */
writers.appendDataSync = function (path, data) {
  // Run append file to delegate creating a new file if none exists
  fs.appendFileSync(path, '')
  var existingData = readers.readDataSync(path)
  var fileFormatter = helpers.discernFileFormatter(path)
  data = existingData.concat(data)
  fs.writeFileSync(path, fileFormatter(data))
}

/**
 * Reads in a dbf file with `.readDbf` and write to file using `.writeData`.
 *
 * @param {String} inFileName the input file name
 * @param {String} outFileName the output file name
 * @param {Function} callback callback that takes error (if any)
 */
writers.writeDbfToData = function (inPath, outPath, cb) {
  readers.readDbf(inPath, function (error, jsonData) {
    if (error) {
      cb(error)
    } else {
      writers.writeData(outPath, jsonData, cb)
    }
  })
}

module.exports = _.extend({}, readers, writers, helpers, { fs: fs })
