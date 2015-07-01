var fs = require('fs')
var dsv = require('dsv')
var dbf = require('shapefile/dbf')
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
    return dsv('|').format(file)
  }
}

var parsers = {
  json: JSON,
  csv: dsv.csv,
  tsv: dsv.tsv,
  psv: dsv('|')
}

var helpers = {}

// Given a file name, determine its extension
// Used by: discernParser, discernFileFormatter
helpers.discernFormat = function (fileName) {
  // If it doesn't contain a dot, return false
  if (!/\./.exec(fileName)) return false
  var name_arr = fileName.split('\.')
  var format_name = name_arr[name_arr.length - 1]
  // If it ends in json such as `topojson` or `geojson`, call it json.
  if (format_name.substr(format_name.length - 4, format_name.length) === 'json') format_name = 'json'
  return format_name
}

// Given a file name, optionally a delimiter, return a parser that will turn that file into json
helpers.discernParser = function (fileName, delimiter) {
  if (delimiter) return dsv(delimiter)
  var format = helpers.discernFormat(fileName)
  return parsers[format]
}

// Given a file name, return a parser that will convert that json object to its extension
helpers.discernFileFormatter = function (fileName) {
  var format = helpers.discernFormat(fileName)
  return formatters[format]
}

var readers = {}

// Figure out what the format is based on its file name
readers.readData = function (path, delimiter_, cb_) {
  var cb = arguments[arguments.length - 1]
  var delimiter = arguments.length === 3 ? delimiter : false
  fs.readFile(path, 'utf8', function (err, data) {
    cb(err, helpers.discernParser(path, delimiter).parse(data))
  })
}
readers.readDataSync = function (path, delimiter) {
  return helpers.discernParser(path, delimiter).parse(fs.readFileSync(path, 'utf8'))
}

readers.readCsv = function (path, cb) {
  fs.readFile(path, 'utf8', function (err, data) {
    cb(err, parsers.csv.parse(data))
  })
}
readers.readCsvSync = function (path) {
  return parsers.csv.parse(fs.readFileSync(path, 'utf8'))
}

readers.readJson = function (path, cb) {
  fs.readFile(path, function (err, data) {
    cb(err, JSON.parse(data))
  })
}
readers.readJsonSync = function (path) {
  return parsers.json.parse(fs.readFileSync(path))
}

readers.readTsv = function (path, cb) {
  fs.readFile(path, 'utf8', function (err, data) {
    cb(err, parsers.tsv.parse(data))
  })
}
readers.readTsvSync = function (path) {
  return parsers.tsv.parse(fs.readFileSync(path, 'utf8'))
}

readers.readPsv = function (path, cb) {
  fs.readFile(path, 'utf8', function (err, data) {
    cb(err, parsers.psv.parse(data))
  })
}
readers.readPsvSync = function (path) {
  return parsers.psv.parse(fs.readFileSync(path, 'utf8'))
}

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
        var json_record = _.object(headers, record)
        rows.push(json_record)
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

readers.readdirInclude = function (path, includes, cb) {
  if (typeof includes === 'string') {
    includes = [includes]
  }
  fs.readdir(path, function (err, files) {
    var filtered = files.filter(function (file) {
      return _.some(includes, function (includeExtension) { return file.indexOf(includeExtension) !== -1 })
    })
    cb(err, filtered)
  })
}
readers.readdirIncludeSync = function (path, includes) {
  if (typeof includes === 'string') {
    includes = [includes]
  }
  return fs.readdirSync(path).filter(function (file) {
    return _.some(includes, function (includeExtension) { return file.indexOf(includeExtension) !== -1 })
  })
}

readers.readdirExclude = function (path, excludes, cb) {
  if (typeof excludes === 'string') {
    excludes = [excludes]
  }
  fs.readdir(path, function (err, files) {
    var filtered = files.filter(function (file) {
      return _.some(excludes, function (excludeExtension) { return file.indexOf(excludeExtension) === -1 })
    })
    cb(err, filtered)
  })
}
readers.readdirExcludeSync = function (path, excludes, cb) {
  if (typeof excludes === 'string') {
    excludes = [excludes]
  }
  return fs.readdirSync(path).filter(function (file) {
    return _.some(excludes, function (excludeExtension) { return file.indexOf(excludeExtension) === -1 })
  })
}

var writers = {}

// Given a file path and json data, convert it to that format and write it
writers.writeData = function (path, data, cb) {
  var fileFormatter = helpers.discernFileFormatter(path)
  fs.writeFile(path, fileFormatter(data), function (err) {
    cb(err)
  })
}
writers.writeDataSync = function (path, data) {
  var fileFormatter = helpers.discernFileFormatter(path)
  fs.writeFileSync(path, fileFormatter(data))
}
writers.writeDbfToData = function (inPath, outPath, cb) {
  readers.readDbf(inPath, function (error, jsonData) {
    if (error) {
      cb(error)
    } else {
      writers.writeData(outPath, jsonData, cb)
    }
  })
}

module.exports = {
  readData: readers.readData,
  readDataSync: readers.readDataSync,
  readCsv: readers.readCsv,
  readCsvSync: readers.readCsvSync,
  readJson: readers.readJson,
  readJsonSync: readers.readJsonSync,
  readTsv: readers.readTsv,
  readTsvSync: readers.readTsvSync,
  readPsv: readers.readPsv,
  readPsvSync: readers.readPsvSync,
  readDbf: readers.readDbf,
  readdirInclude: readers.readdirInclude,
  readdirIncludeSync: readers.readdirIncludeSync,
  readdirExclude: readers.readdirExclude,
  readdirExcludeSync: readers.readdirExcludeSync,

  writeData: writers.writeData,
  writeDataSync: writers.writeDataSync,
  writeDbfToData: writers.writeDbfToData,

  discernFormat: helpers.discernFormat,
  discernParser: helpers.discernParser,
  discernFileFormatter: helpers.discernFileFormatter,

  fs: fs
}
