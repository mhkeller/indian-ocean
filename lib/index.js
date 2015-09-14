var fs = require('fs')
var dsv = require('d3-dsv')
var dbf = require('shapefile/dbf')
var path = require('path')
var queue = require('queue-async')
var _ = require('underscore')
var chalk = require('chalk')

// This library has better error reporting of malformed json
// Enable the parse on the `parse` method for consistency with our other parsers
var JSON_ = {
  parse: require('parse-json')
}

var formatters = {
  json: function (file) {
    return JSON.stringify(file)
  },
  csv: function (file) {
    try {
      return dsv.csv.format(file)
    } catch (err) {
      reportParseError('csv')
    }
  },
  tsv: function (file) {
    try {
      return dsv.tsv.format(file)
    } catch (err) {
      reportParseError('tsv')
    }
  },
  psv: function (file) {
    try {
      return dsv.dsv('|').format(file)
    } catch (err) {
      reportParseError('psv')
    }
  }
}

var parsers = {
  json: JSON_,
  csv: dsv.csv,
  tsv: dsv.tsv,
  psv: dsv.dsv('|')
}

function reportParseError (format) {
  throw new Error(chalk.red('Error converting your data to ' + chalk.bold(format) + '.') + '\n\n' + chalk.cyan('Your data most likely contains objects or lists. Object values can only be strings for this format. Please convert before writing to file.\n'))
}

/** @namespace */
var helpers = {}

/**
 * Given a `fileName` return its file extension. Used internally by `.discernPaser` and `.discernFileFormatter`.
 * @param {String} fileName the name of the file
 * @returns {String} the file's extension
 *
 * @example
 * var format = io.discernFormat('path/to/data.csv')
 * console.log(format) // 'csv'
 */
helpers.discernFormat = function (fileName) {
  var extension = path.extname(fileName)
  if (extension === '') return false

  var formatName = extension.slice(1)
  // If it ends in json such as `topojson` or `geojson`, call it json.
  if (formatName.substr(formatName.length - 4) === 'json') {
    formatName = 'json'
  }
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
 *   console.log(exists) // `true` if the file exists, `false` if not.
 * })
 *
 */
helpers.exists = function (filename, cb) {
  fs.access(function (err) {
    cb(err, err !== null)
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

/**
 * Test whether a file name has the given extension
 *
 * @param {String} fileName the name of the file
 * @returns {String} extension the extension to test
 *
 * @example
 * var matches = io.extensionMatches('path/to/data.tsv', 'tsv')
 * console.log(matches) // `true`
 */
helpers.extensionMatches = function (fileName, extension) {
  // Chop '.' off extension returned by extname
  return path.extname(fileName).slice(1) === extension
}

/**
 * Test whether a string matches a given Regular Expression
 *
 * @param {String} fileName the name of the file
 * @returns {RegExp} regEx the regEx to match with
 *
 * @example
 * var matches = io.matchRegExp('.gitignore', /\.gitignore/)
 * console.log(matches) // `true`
 */
helpers.matchRegExp = function (fileName, regEx) {
  return regEx.test(fileName)
}

/**
 * Test whether a file name matches a given matcher. Delegates to {@link helpers#extensionMatches} if `matcher` is a string`, {@link helpers#matchRegExp} if Regular Expression
 *
 * @param {String} fileName the name of the file
 * @returns {String} matcher the string to match with
 *
 * @example
 * var matches = io.matches('path/to/data.tsv', 'tsv')
 * console.log(matches) // `true`
 *
 * var matches = io.matches('.gitignore', /\.gitignore/)
 * console.log(matches) // `true`
 */
helpers.matches = function (fileName, matcher) {
  if (typeof matcher === 'string') {
    return helpers.extensionMatches(fileName, matcher)
  } else if (_.isRegExp(matcher)) {
    return helpers.matchRegExp(fileName, matcher)
  } else {
    throw new Error('Matcher argument must be String or Regular Expression')
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
 *
 * @example
 * io.readData('path/to/data.tsv', function (err, data) {
 *   console.log(data) // Json data
 * })
 *
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
 *
 * @example
 * var data = io.readDataSync('path/to/data.tsv', function(err, data){
 * console.log(data) // Json data
 *
 */
readers.readDataSync = function (path, delimiter) {
  return helpers.discernParser(path, delimiter).parse(fs.readFileSync(path, 'utf8'))
}

/**
 * Asynchronously read a comma-separated value file.
 *
 * @param {String} fileName the name of the file
 * @param {Function} callback callback used when read data is read, takes error (if any) and the data read
 *
 * @example
 * io.readCsv('path/to/data.csv', function(err, data){
 *   console.log(data) // Json data
 * })
 *
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
 *
 * @example
 * var data = io.readCsvSync('path/to/data.csv', function(err, data){
 * console.log(data) // Json data
 *
 */
readers.readCsvSync = function (path) {
  return parsers.csv.parse(fs.readFileSync(path, 'utf8'))
}

/**
 * Asynchronously read a JSON file.
 *
 * @param {String} fileName the name of the file
 * @param {Function} callback callback used when read data is read, takes error (if any) and the data read
 *
 * @example
 * io.readJson('path/to/data.json', function(err, data){
 *   console.log(data) // Json data
 * })
 *
 */
readers.readJson = function (path, cb) {
  fs.readFile(path, function (err, data) {
    cb(err, parsers.json.parse(data))
  })
}

/**
 * Synchronously read a JSON file.
 *
 * @param {String} fileName the name of the file
 * @returns {Object} the contents of the file as JSON
 *
 * @example
 * var data = io.readCsvSync('path/to/data.json', function(err, data){
 * console.log(data) // Json data
 *
 */
readers.readJsonSync = function (path) {
  return parsers.json.parse(fs.readFileSync(path))
}

/**
 * Asynchronously read a tab-separated value file.
 *
 * @param {String} fileName the name of the file
 * @param {Function} callback callback used when read data is read, takes error (if any) and the data read
 *
 * @example
 * io.readTsv('path/to/data.tsv', function(err, data){
 *   console.log(data) // Json data
 * })
 *
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
 *
 * @example
 * var data = io.readTsvSync('path/to/data.tsv', function(err, data){
 * console.log(data) // Json data
 *
 */
readers.readTsvSync = function (path) {
  return parsers.tsv.parse(fs.readFileSync(path, 'utf8'))
}

/**
 * Asynchronously read a pipe-separated value file.
 *
 * @param {String} fileName the name of the file
 * @param {Function} callback callback used when read data is read, takes error (if any) and the data read
 *
 * @example
 * io.readPsv('path/to/data.psv', function(err, data){
 *   console.log(data) // Json data
 * })
 *
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
 *
 * @example
 * var data = io.readPsvSync('path/to/data.psv', function(err, data){
 * console.log(data) // Json data
 *
 */
readers.readPsvSync = function (path) {
  return parsers.psv.parse(fs.readFileSync(path, 'utf8'))
}

/**
 * Asynchronously read a dbf file.
 *
 * @param {String} fileName the name of the file
 * @param {Function} callback callback used when read data is read, takes error (if any) and the data read
 *
 * @example
 * io.readDbf('path/to/data.json', function(err, data){
 *   console.log(data) // Json data
 * })
 *
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

// Used internally to by `readdir` functions to make more DRY
function readdir (modeInfo, dirPath, inOrExcludesStr, includeFullPath, cb) {
  if (typeof cb !== 'function' && modeInfo.async === true) {
    cb = includeFullPath
  }
  var inOrExcludesArr
  if (!_.isArray(inOrExcludesStr)) {
    inOrExcludesArr = [inOrExcludesStr]
  } else {
    inOrExcludesArr = inOrExcludesStr
  }
  if (modeInfo.async === true) {
    fs.readdir(dirPath, filter(modeInfo.async))
  } else {
    // This looks slightly ugly to make it work both async and sync
    // But it works nicely and is pretty succinct
    return filter(modeInfo.async)(null, fs.readdirSync(dirPath))
  }

  function filter (async) {
    return function (err, files) {
      if (err) {
        throw err
      }
      var filtered = files.filter(function (fileName) {
        // If we're including, then some can pass, otherwise, all must fail
        var strictness = (modeInfo.include) ? 'some' : 'all'
        return _[strictness](inOrExcludesArr, function (includeExtension) { return _.isEqual(modeInfo.include, helpers.matches(fileName, includeExtension)) })
      })
      if (includeFullPath === true) {
        filtered = filtered.map(function (fileName) {
          return path.join(dirPath, fileName)
        })
      }
      if (async) {
        cb(err, filtered)
      } else {
        return filtered
      }
    }
  }
}

/**
 * Get a list of the files in a directory with selected extentions.
 *
 * @param {String} dirPath the directory to read from
 * @param {Array<String>|String|Array<RegExp>|RegExp} includes the file extention(s) to include or RegExp matching file name
 * @param {Boolean} [includeFullPath=false] return the `dirPath` in the result
 * @param {Function} callback the callback that will accept the filtered files, takes an optional error and an array of file names
 *
 * @example
 * // dir contains `data-0.tsv`, `data-0.json`, `data-0.csv`, `data-1.csv`, `.hidden-file`
 * io.readdirInclude('path/to/files', 'csv', function(err, files){
 *   console.log(files) // ['data-0.csv', 'data-1.csv']
 * })
 *
 * io.readdirInclude('path/to/files', ['csv', 'tsv'], true, function(err, files){
 *   console.log(files) // ['path/to/files/data-0.csv', 'path/to/files/data-1.csv', 'path/to/files/data-0.tsv']
 * })
 *
 */
readers.readdirInclude = function (dirPath, includesStr, includeFullPath, cb) {
  readdir({include: true, async: true}, dirPath, includesStr, includeFullPath, cb)
}

/**
 * Synchronously get a list of the files in a directory with selected extentions.
 *
 * @param {String} dirPath the directory to read from
 * @param {Array<String>|String|Array<RegExp>|RegExp} includes the file extention(s) to include or RegExp matching file name
 * @param {Boolean} [includeFullPath=false] return the `dirPath` in the result
 * @returns {Array<String>} the matching files' paths
 *
 * @example
 * // dir contains `data-0.tsv`, `data-0.json`, `data-0.csv`, `data-1.csv`, `.hidden-file`
 * var files = io.readdirIncludeSync('path/to/files', 'csv')
 * console.log(files) // ['data-0.csv', 'data-1.csv']
 *
 * var files = io.readdirIncludeSync('path/to/files', ['csv', 'tsv', /hidden/], true)
 * console.log(files) // ['path/to/files/.hidden-file','path/to/files/data-0.csv', 'path/to/files/data-1.csv', 'path/to/files/data-0.tsv']
 *
 */
readers.readdirIncludeSync = function (dirPath, includesStr, includeFullPath) {
  return readdir({include: true, async: false}, dirPath, includesStr, includeFullPath)
}

/**
 * Get a list of the files in a directory that do not have the selected extentions.
 *
 * @param {String} dirPath the directory to read from
 * @param {Array<String>|String|Array<RegExp>|RegExp} excludes the file extention(s) to exclude or RegExp matching file name
 * @param {Boolean} [includeFullPath=false] return the `dirPath` in the result
 * @param {Function} callback the callback that will accept the filtered files, takes an optional error and an array of file names
 *
 * @example
 * // dir contains `data-0.tsv`, `data-0.json`, `data-0.csv`, `data-1.csv`, `.hidden-file`
 * io.readdirExclude('path/to/files', 'csv', function(err, files){
 *   console.log(files) // ['data-0.tsv', 'data-0.json', '.hidden-file']
 * })
 *
 * io.readdirExclude('path/to/files', ['csv', 'tsv', /^\./], true, function(err, files){
 *   console.log(files) // ['path/to/files/data-0.json']
 * })
 *
 */
readers.readdirExclude = function (dirPath, excludesStr, includeFullPath, cb) {
  readdir({include: false, async: true}, dirPath, excludesStr, includeFullPath, cb)
}

/**
 * Synchronously get a list of the files in a directory that do not have the selected extentions.
 *
 * @param {String} dirPath the directory to read from
 * @param {Array<String>|String|Array<RegExp>|RegExp} excludes the file extention(s) to exclude or RegExp matching file name
 * @param {Boolean} [includeFullPath=false] return the `dirPath` in the result
 * @returns {Array<String>} the matching files' paths
 *
 * @example
 * // dir contains `data-0.tsv`, `data-0.json`, `data-0.csv`, `data-1.csv`, `.hidden-file`
 * var files = io.readdirExcludeSync('path/to/files', 'csv')
 * console.log(files) // ['data-0.tsv', 'data-0.json', '.hidden-file']
 *
 * var files = io.readdirExcludeSync('path/to/files', ['csv', 'tsv', /^\./], true)
 * console.log(files) // ['path/to/files/data-0.json']
 *
 */
readers.readdirExcludeSync = function (dirPath, excludesStr, includeFullPath) {
  return readdir({include: false, async: false}, dirPath, excludesStr, includeFullPath)
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
 *
 * @example
 * io.writeData('path/to/data.json', jsonData, function(err){
 *   console.log(err)
 * })
 *
 * io.writeData('path/to/data.csv', flatJsonData, function(err){
 *   console.log(err)
 * })
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
 *
 * @example
 * io.writeDataSync('path/to/data.json', jsonData)
 *
 * io.writeDataSync('path/to/data.csv', flatJsonData)
 */
writers.writeDataSync = function (path, data) {
  var fileFormatter = helpers.discernFileFormatter(path)
  fs.writeFileSync(path, fileFormatter(data))
}

/**
 * Append to an existing data object, creating a new file if one does not exist. For tabular formats, data must be an array of flat objects (cannot contain nested objects or arrays).
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
 *
 * @example
 * io.writeAppendData('path/to/data.json', jsonData, function(err){
 *   console.log(err)
 * })
 *
 * io.writeAppendData('path/to/data.csv', flatJsonData, function(err){
 *   console.log(err)
 * })
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
 *
 * @example
 * io.writeAppendDataSync('path/to/data.json', jsonData)
 *
 * io.writeAppendDataSync('path/to/data.csv', flatJsonData)
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
 *
 * @example
 * io.writeDbfToData('path/to/data.csv', dbfObj, function(err){
 *   console.log(err)
 * })
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
