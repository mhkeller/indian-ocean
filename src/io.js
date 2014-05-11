var fs  = require('fs'),
		dsv = require('dsv');

function callMeMaybe(cb) {
  return util.isFunction(cb) ? cb : rethrow();
}

var formatters = {
  json: function(file){
    return JSON.stringify(file)
  },
  csv: function(file){
    return dsv.csv.format(file)
  },
  tsv: function(file){
    return dsv.tsv.format(file)
  },
  psv: function(file){
    return dsv('|').format(file)
  }
}

var parsers = {
  json: JSON,
  csv: dsv.csv,
  tsv: dsv.tsv,
  psv: dsv('|')
  // Dbf_Parser: require('node-dbf')
}

var helpers = {};

// Given a file name, determine its extension
// Used by: discernParser, discernFileFormatter
helpers.discernFormat = function(file_name) {
  // If it doesn't contain a dot, return false
  if ( !/\./.exec(file_name) ) return false;
  var name_arr = file_name.split('\.')
  format_name  = name_arr[name_arr.length - 1];
  return format_name
}

// Given a file name, optionally a delimiter, return a parser that will turn that file into json
helpers.discernParser = function(file_name, delimiter){
  if (delimiter) return dsv(delimiter)
  var format = helpers.discernFormat(file_name);
  return parsers[format]
}

// Given a file name, return a parser that will convert that json object to its extension
helpers.discernFileFormatter = function(file_name){
  var format   = helpers.discernFormat(file_name);
  return formatters[format]
}

var readers = {}

// Figure out what the format is based on its file name
readers.readData = function(path, delimiter, cb_){
  var cb = callMeMaybe(arguments[arguments.length - 1]);
  fs.readFile(path, 'utf8', function(err, data){
    cb(err, helpers.discernParser(path, delimiter).parse(data));    
  })
}
readers.readDataSync = function(path, delimiter){
  return helpers.discernParser(path, delimiter).parse(fs.readFileSync(path, 'utf8'));
}

readers.readCsv = function(path, cb){
  fs.readFile(path, 'utf8', function(err, data){
    cb(err, parsers.csv.parse(data));    
  })
}
readers.readCsvSync = function(path){
  return parsers.csv.parse(fs.readFileSync(path, 'utf8'));
}

readers.readJson = function(path, cb){
  fs.readFile(path, function(err, data){
    cb(err, JSON.parse(data));
  })
}
readers.readJsonSync = function(path){
  return parsers.JSON.parse(fs.readFileSync(path));
}

readers.readTsv = function(path, cb){
  fs.readFile(path, 'utf8', function(err, data){
    cb(err, parsers.tsv.parse(data));    
  })
}
readers.readTsvSync = function(path){
  return parsers.tsv.parse(fs.readFileSync(path, 'utf8'));
}

readers.readPsv = function(path, cb){
  fs.readFile(path, 'utf8', function(err, data){
    cb(err, parsers.psv.parse(data));    
  })
}
readers.readPsvSync = function(path){
  return parsers.psv.parse(fs.readFileSync(path, 'utf8'));
}

// readDbf: function(path){
  //   var dbf_parser = new parsers.Dbf_Parser(path),
  //       rows = [];
  //   dbf_parser.on('record', function(p) {
  //       rows.push(p)
  //   });
  //   dbf_parser.on('end', function(p) {
  //       // console.log(rows)
  //   });
  //   dbf_parser.parse();

  // }
//}

var writers = {};

// Given a file path and json data, convert it to that format and write it
writers.writeData = function(path, data, cb){
  var fileFormatter = discernFileFormatter(file_path);
  fs.WriteFile(file_path, fileFormatter(data), function(err){
    cb(err)
  })
}
writers.writeDataSync = function(path, data){
  var fileFormatter = discernFileFormatter(file_path);
  fs.WriteFileSync(file_path, fileFormatter(data))
}

module.exports = {
  readData:             readers.readData,
  readDataSync:         readers.readDataSync,
  readCsv:              readers.readCsv,
  readCsvSync:          readers.readCsvSync,
  readJson:             readers.readJson,
  readJsonSync:         readers.readJsonSync,
  readTsv:              readers.readTsv,
  readTsvSync:          readers.readTsvSync,
  readPsv:              readers.readPsv,
  readPsvSync:          readers.readPsvSync,

  writeData:            writers.writeData,
  writeDataSync:        writers.writeDataSync,

  discernFormat:        helpers.discernFormat,
  discernParser:        helpers.discernParser,
  discernFileFormatter: helpers.discernFileFormatter,
}