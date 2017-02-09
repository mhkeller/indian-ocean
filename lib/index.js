// var flatten = require('flat')
var fs = require('fs')
var dsv = require('d3-dsv')
var dbf = require('dbf')
var shapefileDbf = require('shapefile/dbf')
var path = require('path')
var queue = require('d3-queue').queue
var _ = require('underscore')
var chalk = require('chalk')
var parseJson = require('parse-json') // This library has better error reporting of malformed json.
var yamlParser = require('js-yaml')
var mkdirp = require('mkdirp')
var archieml = require('archieml')

// Equivalents formats
var equivalentFormats = {
  json: ['json', 'topojson', 'geojson'],
  yml: ['yaml']
}

var formatters = {
  json: function (file, writeOptions) {
    writeOptions = writeOptions || {}
    return JSON.stringify(file, writeOptions.replacer, writeOptions.indent)
  },
  csv: function (file, writeOptions) {
    writeOptions = writeOptions || {}
    file = formattingPreflight(file, 'csv')
    try {
      return dsv.csvFormat(file, writeOptions.columns)
    } catch (err) {
      reporters.parseError('csv')
    }
  },
  tsv: function (file, writeOptions) {
    writeOptions = writeOptions || {}
    file = formattingPreflight(file, 'tsv')
    try {
      return dsv.tsvFormat(file, writeOptions.columns)
    } catch (err) {
      reporters.parseError('tsv')
    }
  },
  psv: function (file, writeOptions) {
    writeOptions = writeOptions || {}
    file = formattingPreflight(file, 'psv')
    try {
      return dsv.dsvFormat('|').format(file, writeOptions.columns)
    } catch (err) {
      reporters.parseError('psv')
    }
  },
  yaml: function (file, writeOptions) {
    writeOptions = writeOptions || {}
    var writeMethod = writeOptions.writeMethod || 'safeDump'
    delete writeOptions.writeMethod
    return yamlParser[writeMethod](file, writeOptions)
  },
  txt: _.identity,
  dbf: function (file, writeOptions) {
    writeOptions = writeOptions || {}
    function toBuffer (ab) {
      var buffer = new Buffer(ab.byteLength)
      var view = new Uint8Array(ab)
      for (var i = 0; i < buffer.length; ++i) {
        buffer[i] = view[i]
      }
      return buffer
    }
    var buf = dbf.structure(file)
    return toBuffer(buf.buffer)
  }
}

// Set up some formatter aliases
formatters.yml = formatters.yaml
formatters.geojson = formatters.json
formatters.topojson = formatters.json

// Each parser must return the parsed data
// They can also have a `.parse` method
var parsers = {
  json: function (str, parserOptions) {
    parserOptions = parserOptions || {}
      // Do a naive test whether this is a string or an object
    var mapFn = parserOptions.map ? str.trim().charAt(0) === '[' ? _.map : _.mapObject : _.identity
    var jsonParser = parserOptions.nativeParser === true ? JSON.parse : parseJson
    return mapFn(jsonParser(str, parserOptions.reviver, parserOptions.filename), parserOptions.map)
  },
  csv: function (str, parserOptions) {
    parserOptions = parserOptions || {}
    return dsv.csvParse(str, parserOptions.map)
  },
  tsv: function (str, parserOptions) {
    parserOptions = parserOptions || {}
    return dsv.tsvParse(str, parserOptions.map)
  },
  psv: function (str, parserOptions) {
    parserOptions = parserOptions || {}
    return dsv.dsvFormat('|').parse(str, parserOptions.map)
  },
  txt: function (str, parserOptions) {
    return parserOptions && _.isFunction(parserOptions.map) ? parserOptions.map(str) : str
  },
  yaml: function (str, parserOptions) {
    parserOptions = parserOptions || {}
    var map = parserOptions.map || _.identity
    delete parserOptions.map
    var loadMethod = parserOptions.loadMethod || 'safeLoad'
    delete parserOptions.loadMethod
    var data = yamlParser[loadMethod](str, parserOptions) || {}
    return map(data, map)
  },
  aml: function (str, parserOptions) {
    parserOptions = parserOptions || {}
    var map = parserOptions.map || _.identity
    delete parserOptions.map
    var data = archieml.load(str, parserOptions)
    return map(data, map)
  }
}

// Set up some parser aliases
parsers.yml = parsers.yaml
parsers.geojson = parsers.json
parsers.topojson = parsers.json

var reporters = {}

reporters.warn = function (msg) {
  console.log(chalk.gray('[indian-ocean]') + ' ' + chalk.yellow('Warning:', msg))
}

reporters.writeError = function (format, msg) {
  throw new Error(chalk.red('[indian-ocean] Error writing your data to ' + chalk.bold(format) + '.') + '\n\n' + msg)
}

reporters.parseError = function (format) {
  throw new Error(chalk.red('[indian-ocean] Error converting your data to ' + chalk.bold(format) + '.') + '\n\n' + chalk.cyan('Your data most likely contains objects or lists. Object values can only be strings for this format. Please convert before writing to file.\n'))
}

reporters.notListError = function (format) {
  throw new Error(chalk.red('[indian-ocean] You passed in an object but converting to ' + chalk.bold(format) + ' requires a list of objects.') + chalk.cyan('\nIf you would like to write a one-row csv, put your object in a list like so: `' + chalk.bold('[data]') + '`\n'))
}

/**
  * Various utility functions.
  * @namespace
*/
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
  return formatName
}

/**
 * Given a `fileName` return a parser that can read that file as json. Parses as text if format not supported by a built-in parser. If given a delimter string as the second argument, return a parser for that delimiter regardless of `fileName`. Used internally by `.readData` and `.readDataSync`.
 * @param {String} fileName the name of the file
 * @param {String} delimiter Alternative usage is to pass a delimiter string. Delegates to `dsv.dsvFormat`.
 * @returns {Object} a parser that can read the file
 *
 * @example
 * var parser = io.discernParser('path/to/data.csv')
 * var json = parser('path/to/data.csv')

 * var parser = io.discernParser(null, '_')
 * var json = parser('path/to/data.usv')
 */
helpers.discernParser = function (fileName, delimiter) {
  if (delimiter) {
    return dsv.dsvFormat(delimiter).parse
  }
  var format = helpers.discernFormat(fileName)
  var parser = parsers[format]
  // If we don't have a parser for this format, return as text
  if (typeof parser === 'undefined') {
    parser = parsers['txt']
  }
  return parser
}

// Our `readData` fns can take either a delimiter to parse a file, or a full blown parser
// Determine what they passed in with this handy function
function getParser (delimiterOrParser) {
  var parser
  if (typeof delimiterOrParser === 'string') {
    parser = helpers.discernParser(null, delimiterOrParser)
  } else if (_.isObject(delimiterOrParser) || _.isFunction(delimiterOrParser)) {
    parser = delimiterOrParser
  }
  return parser
}

/**
 * Returns a formatter that will format json data to file type specified by the extension in `fileName`. Used internally by `.writeData` and `.writeDataSync`.
 * @param {String} fileName the name of the file
 * @returns {Object} a formatter that can write the file
 *
 * @example
 * var formatter = io.discernFileFormatter('path/to/data.tsv')
 * var csv = formatter(json)
 */
helpers.discernFileFormatter = function (fileName) {
  var format = helpers.discernFormat(fileName)
  var formatter = formatters[format]
  // If we don't have a parser for this format, return as text
  if (typeof formatter === 'undefined') {
    formatter = formatters['txt']
  }
  return formatter
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
  fs.access(filename, function (err) {
    var exists
    if (err && err.code === 'ENOENT') {
      exists = false
      err = null
    } else if (!err) {
      exists = true
    }
    cb(err, exists)
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
  } catch (ex) {
    return false
  }
}

/**
 * Asynchronously Create directories in a given file path
 *
 * @param {String} outPath The path to a file
 * @param {Function} callback The function to do once this is done. Has signature of `(err)`
 *
 * @example
 * io.makeDirectories('path/to/create/to/data.tsv', function (err) {
 *   console.log(err) // null
 * })
 *
 */
helpers.makeDirectories = function (outPath, cb) {
  mkdirp(path.dirname(outPath), function (err) {
    cb(err)
  })
}

/**
 * Synchronous version of `makeDirectories`
 *
 * @param {String} outPath The path to a file
 *
 * @example
 * io.makeDirectories('path/to/create/to/data.tsv')
 *
 */
helpers.makeDirectoriesSync = function (outPath) {
  mkdirp.sync(path.dirname(outPath))
}

/**
 * Test whether a file name has the given extension
 *
 * @param {String} fileName The name of the file.
 * @param {String} extension The extension to test. An empty string will match a file with no extension.
 * @returns {Boolean} whether The extension matched or not.
 *
 * @example
 * var matches = io.extMatchesStr('path/to/data.tsv', 'tsv')
 * console.log(matches) // `true`
 */
helpers.extMatchesStr = function (filePath, extension) {
  // Chop '.' off extension returned by extname
  var ext = path.extname(filePath).slice(1)
  return ext === extension
}

/**
 * Test whether a string matches a given Regular Expression.
 *
 * @param {String} fileName The name of the file or file path.
 * @param {RegExp} RegEx The RegEx to match with.
 * @returns {Boolean} whether The string matches the RegEx.
 *
 * @example
 * var matches = io.matchesRegExp('.gitignore', /\.gitignore/)
 * console.log(matches) // `true`
 *
 * var matches = io.matchesRegExp('data/final-data/basic.csv', /\/final-data\//)
 * console.log(matches) // `true`
 */
helpers.matchesRegExp = function (str, regEx) {
  return regEx.test(str)
}

/**
 * Test whether a file name or path matches a given matcher. Delegates to {@link helpers#extMatches} if `matcher` is a string` and tests only against the file name extension. Delegates to {@link helpers#extMatchRegEx} if matcher is a Regular Expression and tests against entire string, which is usefulf or testing the full file path.
 *
 * @param {String} fileName The name of the file or path to the file.
 * @returns {String} matcher The string to match with.
 *
 * @example
 * var matches = io.matches('path/to/data.tsv', 'tsv')
 * console.log(matches) // `true`
 *
 * var matches = io.matches('.gitignore', /\.gitignore/)
 * console.log(matches) // `true`
 *
 * var matches = io.matches('file/with/no-extention', '') // Nb. Dot files are treated as files with no extention
 * console.log(matches) // `true`
 */
helpers.matches = function (fileName, matcher) {
  if (typeof matcher === 'string') {
    return helpers.extMatchesStr(fileName, matcher)
  } else if (_.isRegExp(matcher)) {
    return helpers.matchesRegExp(fileName, matcher)
  } else {
    throw new Error('Matcher argument must be String or Regular Expression')
  }
}

/**
 * A port of jQuery's extend. Merge the contents of two or more objects together into the first object. Supports deep extending with `true` as the first argument.
 *
 * @param {Boolean} [deepExtend] Optional, set to `true` to merge recursively.
 * @param {Object} destination The object to modify
 * @param {Object} source The object whose contents to take
 * @param {Object} [source2] Optional, You can add any number of objects as arguments.
 * @returns {Object} result The merged object. Note that the `destination` object will always be modified.
 *
 * @example
 * var mergedObj = io.extend({}, {name: 'indian-ocean'}, {alias: 'io'})
 * console.log(mergedObj)
 * // {
 * //   name: 'indian-ocean',
 * //   alias: 'io'
 * // }
 *
 * var name = {name: 'indian-ocean'}
 * io.extend(name, {alias: 'io'})
 * console.log(name)
 * // {
 * //   name: 'indian-ocean',
 * //   alias: 'io'
 * // }
 *
 * @example
 * var object1 = {
 *   apple: 0,
 *   banana: { weight: 52, price: 100 },
 *   cherry: 97
 * }
 * var object2 = {
 *   banana: { price: 200 },
 *   almond: 100
 * }
 * io.extend(true, object1, object2)
 * console.log(object1)
 * //  {
 * //   apple: 0,
 * //   banana: {
 * //     weight: 52,
 * //     price: 200
 * //   },
 * //   cherry: 97,
 * //   almond: 100
 * // }
 *
 */
helpers.extend = function () {
  var options
  var name
  var src
  var copy
  var copyIsArray
  var clone
  var target = arguments[0] || {}
  var i = 1
  var length = arguments.length
  var deep = false

  // Handle a deep copy situation
  if (typeof target === 'boolean') {
    deep = target

    // Skip the boolean and the target
    target = arguments[i] || {}
    i++
  }

  // Handle case when target is a string or something (possible in deep copy)
  if (typeof target !== 'object' && !_.isFunction(target)) {
    target = {}
  }

  // Extend indian-ocean itself if only one argument is passed
  if (i === length) {
    target = this
    i--
  }

  for (; i < length; i++) {
    // Only deal with non-null/undefined values
    if ((options = arguments[i]) != null) {
      // Extend the base object
      for (name in options) {
        src = target[name]
        copy = options[name]

        // Prevent never-ending loop
        if (target === copy) {
          continue
        }

        // Recurse if we're merging plain objects or arrays
        if (deep && copy && (_.isObject(copy) ||
            (copyIsArray = _.isArray(copy)))) {
          if (copyIsArray) {
            copyIsArray = false
            clone = src && _.isArray(src) ? src : []
          } else {
            clone = src && _.isObject(src) ? src : {}
          }

          // Never move original objects, clone them
          target[name] = helpers.extend(deep, clone, copy)

          // Don't bring in undefined values
        } else if (copy !== undefined) {
          target[name] = copy
        }
      }
    }
  }

  // Return the modified object
  return target
}

/**
 * A more semantic convenience function. Delegates to {@link helpers#extend} and passes `true` as the first argument. Recursively merge the contents of two or more objects together into the first object.
 *
 * @param {Object} destination The object to modify
 * @param {Object} source The object whose contents to take
 * @param {Object} [source2] Optional, You can add any number of objects as arguments.
 * @returns {Object} result The merged object. Note that the `destination` object will always be modified.
 *
 * @example
 * var object1 = {
 *   apple: 0,
 *   banana: { weight: 52, price: 100 },
 *   cherry: 97
 * }
 * var object2 = {
 *   banana: { price: 200 },
 *   almond: 100
 * }
 * io.deepExtend(object1, object2)
 * console.log(object1)
 * //  {
 * //   apple: 0,
 * //   banana: {
 * //     weight: 52,
 * //     price: 200
 * //   },
 * //   cherry: 97,
 * //   almond: 100
 * // }
 *
 */
helpers.deepExtend = function () {
  var args = Array.prototype.slice.call(arguments) // Make real array from arguments
  args.unshift(true) // Add `true` as first arg.
  helpers.extend.apply(this, args)
}

// Some shared data integrity checks for formatters
function formattingPreflight (file, format) {
  if (file === '') {
    return []
  } else if (!_.isArray(file)) {
    reporters.notListError(format)
  }
  return file
}

/**
  * Functions to read data files.
  * @namespace
*/
var readers = {}

/**
 * Asynchronously read data given a path ending in the file format.
 *
 * Supported formats / extensions:
 *
 * * `.json` Array of objects
 * * `.csv` Comma-separated
 * * `.tsv` Tab-separated
 * * `.psv` Pipe-separated
 * * `.yaml` or `.yml` Yaml file
 * * `.aml` ArchieML
 * * `.txt` Text file (a string)
 * * other All others are read as a text file
 *
 * *Note: Does not currently support `.dbf` files. `.yaml` and `.yml` formats are read with js-yaml's `.load` method, which has no security checking. See js-yaml library for more secure options.*
 *
 * @param {String} fileName the name of the file
 * @param {Object|Function} [parserOptions] Optional. Set this as a function as a shorthand for `map`.
 * @param {String|Function|Object} [parserOptions.parser] optional This can be a string that is the file's delimiter or a function that returns the json. See `parsers` in library source for examples. For convenience, this can also take a dsv object such as `dsv.dsv('_')` or any object that has a `parse` method.
 * @param {Function} [parserOptions.map] Transformation function. Takes `(fileString, parserOptions)` where `parserOptions` is the hash you pass in minus the `parser` key. See {@link shorthandReaders} for specifics.
 * @param {Boolean} [parserOptions.nativeParser] Used in {@link shorthandReaders.readJson} for now. Otherwise ignored.
 * @param {Function} [parserOptions.comments] Used in {@link shorthandReaders.readAml}. Otherwise ignored.
 * @param {Function} [parserOptions.reviver] Used in {@link shorthandReaders.readJson}. Otherwise ignored.
 * @param {Function} [parserOptions.filename] Used in {@link shorthandReaders.readJson}. Otherwise ignored.
 * @param {Function} callback callback used when read data is read, takes error (if any) and the data read
 *
 * @example
 * io.readData('path/to/data.tsv', function (err, data) {
 *   console.log(data) // Json data
 * })
 *
 * // Parser specified as a string
 * io.readData('path/to/data.usv', {parser: '_'}, function (err, data) {
 *   console.log(data) // Json data
 * })
 *
 * // Parser specified as a function
 * var myParser = dsv.dsv('_').parse
 * // var myParser = dsv.dsv('_') // This also works
 * io.readData('path/to/data.usv', {parser: myParser}, function (err, data) {
 *   console.log(data) // Json data
 * })
 *
 * // Parser specified with an object that has a `parse` function
 * var naiveJsonLines = {
 *   parse: function (dataAsString) {
 *     return dataAsString.split('\n').map(function (row) { return JSON.parse(row) })
 *   }
 * }
 * io.readData('path/to/data.jsonlines', {parser: naiveJsonLines}, function (err, data) {
 *   console.log(data) // Json data
 * })
 *
 * // Shorthand for specifying a map function
 * io.readData('path/to/data.csv', function (row, i, columns) {
 *   console.log(columns) // [ 'name', 'occupation', 'height' ]
 *   row.height = +row.height // Convert this value to a number
 *   return row
 * }, function (err, data) {
 *   console.log(data) // Json data
 * })
 *
 * // Explicitly specify a map function and a filename for a json file. See `readJson` for more details
 * io.readData('path/to/data.json', {
 *   map: function (k, v) {
 *     if (typeof v === 'number') {
 *       return v * 2
 *     }
 *     return v
 *   },
 *   filename: 'awesome-data.json'
 * }, function (err, data) {
 *   console.log(data) // Json data with any number values multiplied by two and errors reported with `fileName`
 * })
 */
readers.readData = function (path, opts_, cb_) {
  var cb = arguments[arguments.length - 1]
  var parser
  var parserOptions
  if (arguments.length === 3) {
    if (opts_.parser) {
      parser = getParser(opts_.parser)
      delete opts_.parser
      if (_.isEmpty(opts_)) {
        opts_ = undefined
      }
    } else {
      parser = helpers.discernParser(path)
    }

    if (opts_ && opts_.parserOptions) {
      if (_.isFunction(opts_.parserOptions)) {
        parserOptions = {map: opts_.parserOptions}
      } else {
        parserOptions = opts_.parserOptions
      }
    } else if (opts_) {
      if (_.isFunction(opts_)) {
        parserOptions = {map: opts_}
      } else {
        parserOptions = opts_
      }
    }
  } else {
    parser = helpers.discernParser(path)
  }
  fs.readFile(path, 'utf8', function (err, data) {
    if (equivalentFormats.json.indexOf(helpers.discernFormat(path)) > -1 && data === '') {
      data = '[]'
    }
    if (err) {
      cb(err)
      return false
    }
    var parsed
    try {
      if (_.isFunction(parser)) {
        parsed = parser(data, parserOptions)
      } else if (_.isObject(parser) && _.isFunction(parser.parse)) {
        parsed = parser.parse(data, parserOptions)
      } else {
        parsed = 'Your specified parser is not properly formatted. It must either be a function or have a `parse` method.'
      }
    } catch (err) {
      cb(err)
      return
    }
    cb(null, parsed)
  })
}

/**
 * Syncronous version of {@link readers#readData}
 *
 * @param {String} fileName the name of the file
 * @param {Object|Function} [options] Optional. Set this as a function as a shorthand for `map`.
 * @param {String|Function|Object} [options.parser] optional This can be a string that is the file's delimiter or a function that returns the json. See `parsers` in library source for examples. For convenience, this can also take a dsv object such as `dsv.dsv('_')` or any object that has a `parse` method.
 * @param {Function} [options.map] Transformation function. Takes `(fileString, options)` where `options` is the hash you pass in minus the `parser` key. See {@link shorthandReaders} for specifics.
 * @param {Function} [options.reviver] Used in {@link shorthandReaders.readJson}. Otherwise ignored.
 * @param {Function} [options.filename] Used in {@link shorthandReaders.readJson}. Otherwise ignored.
 * @returns {Object} the contents of the file as JSON
 *
 * @example
 * var data = io.readDataSync('path/to/data.tsv')
 * console.log(data) // Json data
 *
 * // Parser specified as a string
 * var data = io.readDataSync('path/to/data.usv', {parser: '_'})
 * console.log(data) // Json data
 *
 * // Parser specified as a function
 * var myParser = dsv.dsv('_').parse
 * // var myParser = dsv.dsv('_') // This also works
 * var data = io.readDataSync('path/to/data.usv', {parser: myParser})
 * console.log(data) // Json data
 *
 * // Parser as an object with a `parse` method
 * var naiveJsonLines = {
 *   parse: function(dataAsString)
 *     return dataAsString.split('\n').map(function (row) { return JSON.parse(row) })
 *   }
 * }
 * var data = io.readDataSync('path/to/data.jsonlines', {parser: naiveJsonLines})
 * console.log(data) // Json data
 *
 * // Shorthand for specifying a map function
 * var data = io.readData('path/to/data.csv', function (row, i, columns) {
 *   console.log(columns) // [ 'name', 'occupation', 'height' ]
 *   row.height = +row.height // Convert this value to a number
 *   return row
 * })
 * console.log(data) // Json data
 *
 * // Explicitly specify a map function and a filename for a json file. See `readJson` for more details
 * var data = io.readData('path/to/data.json', {
 *   map: function (k, v) {
 *     if (typeof v === 'number') {
 *       return v * 2
 *     }
 *     return v
 *   },
 *   filename: 'awesome-data.json'
 * })
 * console.log(data) // Json data with any number values multiplied by two and errors reported with `fileName`
 */
readers.readDataSync = function (path, opts_) {
  var parser
  var parserOptions
  if (arguments.length === 2) {
    if (opts_.parser) {
      parser = getParser(opts_.parser)
      delete opts_.parser
      if (_.isEmpty(opts_)) {
        opts_ = undefined
      }
    } else {
      parser = helpers.discernParser(path)
    }

    if (opts_ && opts_.parserOptions) {
      if (_.isFunction(opts_.parserOptions)) {
        parserOptions = {map: opts_.parserOptions}
      } else {
        parserOptions = opts_.parserOptions
      }
    } else if (opts_) {
      if (_.isFunction(opts_)) {
        parserOptions = {map: opts_}
      } else {
        parserOptions = opts_
      }
    }
  } else {
    parser = helpers.discernParser(path)
  }
  var data = fs.readFileSync(path, 'utf8')
  if (equivalentFormats.json.indexOf(helpers.discernFormat(path)) > -1 && data === '') {
    data = '[]'
  }

  var parsed
  if (_.isFunction(parser)) {
    parsed = parser(data, parserOptions)
  } else if (_.isObject(parser) && _.isFunction(parser.parse)) {
    parsed = parser.parse(data, parserOptions)
  } else {
    return new Error('Your specified parser is not properly formatted. It must either be a function or have a `parse` method.')
  }

  // if (opts_ && opts_.flatten) {
  //   parsed = _.map(parsed, flatten)
  // }
  return parsed
}

/**
 * Get a list of a directory's files and folders if certain critera are met.
 *
 * @param {String} dirPath The directory to read from
 * @param {Object} options Optional, filter options, see below
 * @param {String|RegExp|Array<String>|Array<RegExp>} options.include If given a string, return files that have that string as their extension. If given a Regular Expression, return the file that matches the pattern. Can also take a list of both. List matching behavior is described in `includeAll`.
 * @param {String|RegExp|Array<String>|Array<RegExp>} options.exclude If given a string, return files that do not have that string as their extension. If given a Regular Expression, return the file that matches the pattern. Can also take a list of both. List matching behavior is described in `excludeAll`.
 * @param {Boolean} [options.includeMatchAll=false] If true, require all include conditions to be met for a file to be included.
 * @param {Boolean} [options.excludeMatchAll=false] If true, require all exclude conditions to be met for a file to be excluded.
 * @param {Boolean} [options.fullPath=false] If `true` the full path of the file, otherwise return just the file name.
 * @param {Boolean} [options.skipFiles=false] If `true`, only include directories.
 * @param {Boolean} [options.skipDirectories=false] If `true`, only include files.
 * @param {Function} callback Callback fired with signature of `(err, files)` where `files` is a list of matching file names.
 *
 * @example
 * // dir contains `data-0.tsv`, `data-0.json`, `data-0.csv`, `data-1.csv`, `.hidden-file`
 * io.readdirFilter('path/to/files', {include: 'csv'}, function(err, files){
 *   console.log(files) // ['data-0.csv', 'data-1.csv']
 * })
 *
 * io.readdirFilter('path/to/files', {include: [/^data/], exclude: ['csv', 'json']}, , function(err, files){
 *   console.log(files) // ['path/to/files/data-0.csv', 'path/to/files/data-1.csv', 'path/to/files/data-0.tsv']
 * })
 *
 */
readers.readdirFilter = function (dirPath, opts_, cb) {
  if (typeof cb === 'undefined') {
    cb = opts_
    opts_ = undefined
  }

  readdir({async: true}, dirPath, opts_, cb)
}

/**
 * Synchronously get a list of a directory's files and folders if certain critera are met.
 *
 * @param {String} dirPath The directory to read from
 * @param {Object} [options] Optional, filter options, see below
 * @param {String|RegExp|Array<String>|Array<RegExp>} [options.include] Optional, if given a string, return files that have that string as their extension. If given a Regular Expression, return the file that matches the pattern. Can also take a list of both. List matching behavior is described in `includeAll`.
 * @param {String|RegExp|Array<String>|Array<RegExp>} [options.exclude] Optional, if given a string, return files that do not have that string as their extension. If given a Regular Expression, return the file that matches the pattern. Can also take a list of both. List matching behavior is described in `excludeAll`.
 * @param {Boolean} [options.includeMatchAll=false] Optional, if true, require all include conditions to be met for a file to be included.
 * @param {Boolean} [options.excludeMatchAll=false] Optional, if true, require all exclude conditions to be met for a file to be excluded.
 * @param {Boolean} [options.fullPath=false] Optional, if `true` the full path of the file, otherwise return just the file name.
 * @param {Boolean} [options.skipFiles=false] Optional, if `true`, only include directories.
 * @param {Boolean} [options.skipDirectories=false] Optional, if `true`, only include files.
 * @returns {Array<String>} The matching file names
 *
 * @example
 * // dir contains `data-0.tsv`, `data-0.json`, `data-0.csv`, `data-1.csv`, `.hidden-file`
 * var files = io.readdirFilterSync('path/to/files', {include: 'csv'})
 * console.log(files) // ['data-0.csv', 'data-1.csv']
 *
 * var files = io.readdirFilterSync('path/to/files', {include: [/^data/], exclude: 'json', fullPath: true})
 * console.log(files) // ['path/to/files/data-0.csv', 'path/to/files/data-1.csv', 'path/to/files/data-0.tsv']
 *
 * var files = io.readdirFilterSync('path/to/files', {include: [/^data/, 'json'], fullPath: true, includeMatchAll: true})
 * console.log(files) // ['path/to/files/data-0.json', 'path/to/files/data-1.json']
 *
 */
readers.readdirFilterSync = function (dirPath, opts_) {
  return readdir({async: false}, dirPath, opts_)
}

/**
  * Convenience functions to load in a file with a specific type. This is equivalent to using `readData` and specifying a parser.
  * @namespace
*/
var shorthandReaders = {}

/**
 * Asynchronously read a comma-separated value file. Returns an empty array if file is empty.
 *
 * @param {String} fileName the name of the file
 * @param {Function} [map] Optional map function, called once for each row (header row skipped). Has signature `(row, i, columns)`. See example below or d3-dsv documentation for details.
 * @param {Function} callback callback used when read data is read, takes error (if any) and the data read
 *
 * @example
 * io.readCsv('path/to/data.csv', function (err, data) {
 *   console.log(data) // Json data
 * })
 *
 * // Transform values on load
 * io.readCsv('path/to/data.csv', function (row, i, columns) {
 *   console.log(columns) // [ 'name', 'occupation', 'height' ]
 *   row.height = +row.height // Convert this value to a number
 *   return row
 * }, function (err, data) {
 *   console.log(data) // Converted json data
 * })
 */
shorthandReaders.readCsv = function (path, opts_, cb) {
  var parserOptions
  if (typeof cb === 'undefined') {
    cb = opts_
  } else {
    parserOptions = _.isFunction(opts_) ? {map: opts_} : opts_
  }
  readers.readData(path, {parser: parsers.csv, parserOptions: parserOptions}, cb)
}

/**
 * Synchronously read a comma-separated value file. Returns an empty array if file is empty.
 *
 * @param {String} fileName the name of the file
 * @param {Function|Object} [map] Optional map function, called once for each row (header row skipped). Has signature `(row, i, columns)`. See example below or d3-dsv documentation for details.
 * @returns {Array} the contents of the file as JSON
 *
 * @example
 * var data = io.readCsvSync('path/to/data.csv')
 * console.log(data) // Json data
 *
 * // Transform values on load
 * var data = io.readCsvSync('path/to/data.csv', function (row, i, columns) {
 *   console.log(columns) // [ 'name', 'occupation', 'height' ]
 *   row.height = +row.height // Convert this value to a number
 *   return row
 * })
 * console.log(data) // Json data with casted values
 */
shorthandReaders.readCsvSync = function (path, opts_) {
  var parserOptions
  if (typeof opts_ !== 'undefined') {
    parserOptions = _.isFunction(opts_) ? {map: opts_} : opts_
  }
  return readers.readDataSync(path, {parser: parsers.csv, parserOptions: parserOptions})
}

/**
 * Asynchronously read a JSON file. Returns an empty array if file is empty.
 *
 * @param {String} fileName the name of the file
 * @param {Function|String|Object} [parserOptions] Can be a map function, a filename string that's display as an error message or an object specifying both and other options.
 * @param {Function} [parserOptions.map] Optional map function, called once for each row (header row skipped). If your file is an array (tests if first non-whitespace character is a `[`), has signature `(row, i)`, delegates to `_.map`. If file is an object has signature `(value, key)`, delegates to `_.mapObject`. See example below.
 * @param {Boolean} [parserOptions.nativeParser] Use native JSON parser instead of parse-json library for better performance but not as good error messaging. This can be nice to turn on for produciton use.
 * @param {String} [parserOptions.filename] Filename displayed in the error message.
 * @param {String} [parserOptions.reviver] Prescribes how the value originally produced by parsing is mapped, before being returned. See JSON.parse docs for more: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse#Using_the_reviver_parameter
 * @param {Function} callback Function invoked after data is read, takes error (if any) and the data read
 *
 * @example
 * io.readJson('path/to/data.json', function (err, data) {
 *   console.log(data) // Json data
 * })
 *
 * // Specify a map
 * io.readJson('path/to/data.json', function (row, i) {
 *   row.height = row.height * 2
 *   return row
 * }, function (err, data) {
 *   console.log(data) // Json data with height multiplied by two
 * })
 *
 * // Specify a filename
 * io.readJson('path/to/data.json', 'awesome-data.json', function (err, data) {
 *   console.log(data) // Json data, any errors are reported with `fileName`.
 * })
 *
 * // Specify a map and a filename
 * io.readJson('path/to/data.json', {
 *   map: function (row, i) {
 *     row.height = row.height * 2
 *     return row
 *   },
 *   filename: 'awesome-data.json'
 * }, function (err, data) {
 *   console.log(data) // Json data with any number values multiplied by two and errors reported with `fileName`
 * })
 *
 * // Specify a map and a filename on json object
 * io.readJson('path/to/json-object.json', {
 *   map: function (value, key) {
 *     if (typeof value === 'number') {
 *       return value * 2
 *     }
 *     return value
 *   },
 *   filename: 'awesome-data.json'
 * }, function (err, data) {
 *   console.log(data) // Json data with any number values multiplied by two and errors reported with `fileName`
 * })
 *
 * // Specify a reviver function and a filename
 * io.readJson('path/to/data.json', {
 *   reviver: function (k, v) {
 *     if (typeof v === 'number') {
 *       return v * 2
 *     }
 *     return v
 *   },
 *   filename: 'awesome-data.json'
 * }, function (err, data) {
 *   console.log(data) // Json data with any number values multiplied by two and errors reported with `fileName`
 * })
 */
shorthandReaders.readJson = function (path, opts_, cb) {
  var parserOptions
  if (typeof cb === 'undefined') {
    cb = opts_
  } else {
    parserOptions = _.isFunction(opts_) ? {map: opts_} : opts_
  }
  readers.readData(path, {parser: parsers.json, parserOptions: parserOptions}, cb)
}

/**
 * Synchronously read a JSON file. Returns an empty array if file is empty.
 *
 * @param {String} fileName the name of the file
 * @param {Function|String|Object} [parserOptions] Can be a map function, a filename string that's display as an error message or an object specifying both and other options.
 * @param {Function} [parserOptions.map] Optional map function, called once for each row (header row skipped). If your file is an array (tests if first non-whitespace character is a `[`), has signature `(row, i)`, delegates to `_.map`. If file is an object has signature `(value, key)`, delegates to `_.mapObject`. See example below.
 * @param {Boolean} [parserOptions.nativeParser] Use native JSON parser instead of parse-json library for better performance but not as good error messaging. This can be nice to turn on for produciton use.
 * @param {String} [parserOptions.filename] Filename displayed in the error message.
 * @param {String} [parserOptions.reviver] Prescribes how the value originally produced by parsing is mapped, before being returned. See JSON.parse docs for more: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse#Using_the_reviver_parameter
 * @returns {Array} the contents of the file as JSON
 *
 * @example
 * var data = io.readJsonSync('path/to/data.json')
 * console.log(data) // Json data
 *
 * // Specify a map
 * var data = io.readJson('path/to/data.json', function (k, v) {
 *   if (typeof v === 'number') {
 *     return v * 2
 *   }
 *   return v
 * })
 * console.log(data) // Json data with any number values multiplied by two
 *
 * // Specify a filename
 * var data = io.readJson('path/to/data.json', 'awesome-data.json')
 * console.log(data) // Json data, any errors are reported with `fileName`.
 *
 * // Specify a map and a filename
 * var data = io.readJsonSync('path/to/data.json', {
 *   map: function (k, v) {
 *     if (typeof v === 'number') {
 *       return v * 2
 *     }
 *     return v
 *   },
 *   filename: 'awesome-data.json'
 * })
 *
 * console.log(data) // Json data with any number values multiplied by two and errors reported with `fileName`
 */
shorthandReaders.readJsonSync = function (path, opts_) {
  var parserOptions
  if (typeof opts_ !== 'undefined') {
    parserOptions = _.isFunction(opts_) ? {map: opts_} : opts_
  }
  return readers.readDataSync(path, {parser: parsers.json, parserOptions: parserOptions})
}

/**
 * Asynchronously read a tab-separated value file. Returns an empty array if file is empty.
 *
 * @param {String} fileName the name of the file
 * @param {Function} [map] Optional map function, called once for each row (header row skipped). Has signature `(row, i, columns)`. See example below or d3-dsv documentation for details.
 * @param {Function} callback callback used when read data is read, takes error (if any) and the data read
 *
 * @example
 * io.readTsv('path/to/data.tsv', function (err, data) {
 *   console.log(data) // Json data
 * })
 *
 * // Transform values on load
 * io.readTsv('path/to/data.tsv', function (row, i, columns) {
 *     console.log(columns) // [ 'name', 'occupation', 'height' ]
 *     row.height = +row.height // Convert this value to a number
 *     return row
 * }, function (err, data) {
 *   console.log(data) // Json data with casted values
 * })
 */
shorthandReaders.readTsv = function (path, opts_, cb) {
  var parserOptions
  if (typeof cb === 'undefined') {
    cb = opts_
  } else {
    parserOptions = _.isFunction(opts_) ? {map: opts_} : opts_
  }
  readers.readData(path, {parser: parsers.tsv, parserOptions: parserOptions}, cb)
}

/**
 * Synchronously read a tab-separated value file. Returns an empty array if file is empty.
 *
 * @param {String} fileName the name of the file
 * @param {Function} [map] Optional map function, called once for each row (header row skipped). Has signature `(row, i, columns)`. See example below or d3-dsv documentation for details.
 * @returns {Array} the contents of the file as JSON
 *
 * @example
 * var data = io.readTsvSync('path/to/data.tsv')
 * console.log(data) // Json data
 *
 * // Transform values on load
 * var data = io.readTsvSync('path/to/data.tsv', function (row, i, columns) {
 *   console.log(columns) // [ 'name', 'occupation', 'height' ]
 *   row.height = +row.height // Convert this value to a number
 *   return row
 * })
 * console.log(data) // Json data with casted values
 */
shorthandReaders.readTsvSync = function (path, opts_) {
  var parserOptions
  if (typeof opts_ !== 'undefined') {
    parserOptions = _.isFunction(opts_) ? {map: opts_} : opts_
  }
  return readers.readDataSync(path, {parser: parsers.tsv, parserOptions: parserOptions})
}

/**
 * Asynchronously read a pipe-separated value file. Returns an empty array if file is empty.
 *
 * @param {String} fileName the name of the file
 * @param {Function} [map] Optional map function, called once for each row (header row skipped). Has signature `(row, i, columns)`. See example below or d3-dsv documentation for details.
 * @param {Function} callback callback used when read data is read, takes error (if any) and the data read
 *
 * @example
 * io.readPsv('path/to/data.psv', function (err, data) {
 *   console.log(data) // Json data
 * })
 *
 * // Transform values on load
 * io.readPsv('path/to/data.psv', function (row, i, columns) {
 *     console.log(columns) // [ 'name', 'occupation', 'height' ]
 *     row.height = +row.height // Convert this value to a number
 *     return row
 * }, function (err, data) {
 *   console.log(data) // Json data with casted values
 * })
 */
shorthandReaders.readPsv = function (path, opts_, cb) {
  var parserOptions
  if (typeof cb === 'undefined') {
    cb = opts_
  } else {
    parserOptions = _.isFunction(opts_) ? {map: opts_} : opts_
  }
  readers.readData(path, {parser: parsers.psv, parserOptions: parserOptions}, cb)
}

/**
 * Synchronously read a pipe-separated value file. Returns an empty array if file is empty.
 *
 * @param {String} fileName the name of the file
 * @param {Function} [map] Optional map function, called once for each row (header row skipped). Has signature `(row, i, columns)`. See example below or d3-dsv documentation for details.
 * @returns {Array} the contents of the file as JSON
 *
 * @example
 * var data = io.readPsvSync('path/to/data.psv')
 * console.log(data) // Json data
 *
 * var data = io.readPsvSync('path/to/data.psv', function (row, i, columns) {
 *   console.log(columns) // [ 'name', 'occupation', 'height' ]
 *   row.height = +row.height // Convert this value to a number
 *   return row
 * })
 * console.log(data) // Json data with casted values
 */
shorthandReaders.readPsvSync = function (path, opts_) {
  var parserOptions
  if (typeof opts_ !== 'undefined') {
    parserOptions = _.isFunction(opts_) ? {map: opts_} : opts_
  }
  return readers.readDataSync(path, {parser: parsers.psv, parserOptions: parserOptions})
}

/**
 * Asynchronously read a text file. Returns an empty string if file is empty.
 *
 * @param {String} fileName the name of the file
 * @param {Function} [map] Optional map function, take the file and returns any mapped value
 * @param {Function} callback callback used when read data is read, takes error (if any) and the data read
 *
 * @example
 * io.readTxt('path/to/data.txt', function (err, data) {
 *   console.log(data) // string data
 * })
 *
 * io.readTxt('path/to/data.txt', function (str) {
 *   return str.replace(/hello/g, 'goodbye') // Replace all instances of `"hello"` with `"goodbye"`
 * }, function (err, data) {
 *   console.log(data) // string data with values replaced
 * })
 */
shorthandReaders.readTxt = function (path, opts_, cb) {
  var parserOptions
  if (typeof cb === 'undefined') {
    cb = opts_
  } else {
    parserOptions = _.isFunction(opts_) ? {map: opts_} : opts_
  }
  readers.readData(path, {parser: parsers.txt, parserOptions: parserOptions}, cb)
}

/**
 * Synchronously read a text file. Returns an empty string if file is empty.
 *
 * @param {String} fileName the name of the file
 * @param {Function} [map] Optional map function, called once for each row (header row skipped). Has signature `(row, i, columns)`. See example below or d3-dsv documentation for details.
 * @returns {Array} the contents of the file as a string
 *
 * @example
 * var data = io.readTxtSync('path/to/data.txt')
 * console.log(data) // string data
 *
 * var data = io.readTxtSync('path/to/data.txt', function (str) {
 *   return str.replace(/hello/g, 'goodbye') // Replace all instances of `"hello"` with `"goodbye"`
 * })
 * console.log(data) // string data with values replaced
 */
shorthandReaders.readTxtSync = function (path, opts_) {
  var parserOptions
  if (typeof opts_ !== 'undefined') {
    parserOptions = _.isFunction(opts_) ? {map: opts_} : opts_
  }
  return readers.readDataSync(path, {parser: parsers.txt, parserOptions: parserOptions})
}

/**
 * Asynchronously read a yaml file. Returns an empty object if file is empty. `parseOptions` will pass any other optinos directl to js-yaml library. See its documentation for more detail https://github.com/nodeca/js-yaml
 *
 * @param {String} fileName the name of the file
 * @param {Function|Object} [parserOptions] Can be a map function or an object specifying that or other options.
 * @param {Function} [parserOptions.map] Optional map function. Takes the parsed filed, return modified file. See example below.
 * @param {String} [parserOptions.loadMethod="safeLoad"] The js-yaml library allows you to specify a more liberal `load` method which will accept regex and function values.
 * @param {Function} callback callback used when read data is read, takes error (if any) and the data read
 *
 * @example
 * // Can be `.yaml` or `.yml` extension
 * io.readYaml('path/to/data.yaml', function (err, data) {
 *   console.log(data) // json data
 * })
 *
 * // With map function shorthand on an object
 * io.readYaml('path/to/data.yaml', function (yamlFile) {
 *   yamlFile.height = yamlFile.height * 2
 *   return yamlFile
 * }, function (err, data) {
 *   console.log(data) // json data with `height` values doubled
 * })
 *
 * // With map function on an object and load settings
 * io.readYaml('path/to/data.yaml', {
 *   loadMethod: 'load',
 *   map: function (value, key) {
 *     yamlFile.height = yamlFile.height * 2
 *     return yamlFile
 *   }
 * }, function (err, data) {
 *   console.log(data) // json data with `height` values doubled
 * })
 */
shorthandReaders.readYaml = function (path, opts_, cb) {
  var parserOptions
  if (typeof cb === 'undefined') {
    cb = opts_
  } else {
    parserOptions = _.isFunction(opts_) ? {map: opts_} : opts_
  }
  readers.readData(path, {parser: parsers.yaml, parserOptions: parserOptions}, cb)
}

/**
 * Synchronously read a yaml file. Returns an empty object if file is empty. `parseOptions` will pass any other optinos directl to js-yaml library. See its documentation for more detail https://github.com/nodeca/js-yaml
 *
 * @param {String} fileName the name of the file
 * @param {Function|Object} [parserOptions] Can be a map function or an object specifying that or other options.
 * @param {Function} [parserOptions.map] Optional map function. Takes the parsed filed, return modified file. See example below.
 * @param {String} [parserOptions.loadMethod="safeLoad"] The js-yaml library allows you to specify a more liberal `load` method which will accept regex and function values.
 * @returns {Array} the contents of the file as a string
 *
 * @example
 * // Can be `.yaml` or `.yml` extension
 * var data = io.readYamlSync('path/to/data.yaml')
 * console.log(data) // json data
 *
 * // With map function
 * var data = io.readYaml('path/to/data.yaml', function (yamlFile) {
 *   yamlFile.height = yamlFile.height * 2
 *   return yamlFile
 * })
 * console.log(data) // json data with `height` values doubled
 *
 * // With map function and load settings
 * var data = io.readYaml('path/to/data.yaml', {
 *   loadMethod: 'load',
 *   map: function (yamlFile) {
 *     yamlFile.height = yamlFile.height * 2
 *     return yamlFile
 *   }
 * })
 * console.log(data) // json data with `height` values doubled
 */
shorthandReaders.readYamlSync = function (path, opts_) {
  var parserOptions
  if (typeof opts_ !== 'undefined') {
    parserOptions = _.isFunction(opts_) ? {map: opts_} : opts_
  }
  return readers.readDataSync(path, {parser: parsers.yaml, parserOptions: parserOptions})
}

/**
 * Asynchronously read an ArchieMl file. Returns an empty object if file is empty.
 *
 * @param {String} fileName the name of the file.
 * @param {Function} [map] Optional map function. Takes the parsed filed, return modified file. See example below.
 * @param {Function} callback callback used when read data is read, takes error (if any) and the data read.
 *
 * @example
 * io.readAml('path/to/data.aml', function (err, data) {
 *   console.log(data) // json data
 * })
 *
 * // With map
 * io.readAml('path/to/data.aml', function (amlFile) {
 *   amlFile.height = amlFile.height * 2
 *   return amlFile
 * }, function (err, data) {
 *   console.log(data) // json data with height multiplied by 2
 * })
 */
shorthandReaders.readAml = function (path, opts_, cb) {
  var parserOptions
  if (typeof cb === 'undefined') {
    cb = opts_
  } else {
    parserOptions = _.isFunction(opts_) ? {map: opts_} : opts_
  }
  readers.readData(path, {parser: parsers.aml, parserOptions: parserOptions}, cb)
}

/**
 * Synchronously read an ArchieML file. Returns an empty TK if file is empty.
 *
 * @param {String} fileName the name of the file
 * @param {Function} [map] Optional map function. Takes the parsed filed, return modified file. See example below.
 * @returns {Object} the contents of the file as a string
 *
 * @example
 * var data = io.readAmlSync('path/to/data.aml')
 * console.log(data) // json data
 *
 * var data = io.readAmlSync('path/to/data-with-comments.aml', function (amlFile) {
 *   amlFile.height = amlFile.height * 2
 *   return amlFile
 * })
 * console.log(data) // json data with height multiplied by 2
 */
shorthandReaders.readAmlSync = function (path, opts_) {
  var parserOptions
  if (typeof opts_ !== 'undefined') {
    parserOptions = _.isFunction(opts_) ? {map: opts_} : opts_
  }
  return readers.readDataSync(path, {parser: parsers.aml, parserOptions: parserOptions})
}

/**
 * Asynchronously read a dbf file. Returns EOF error if file is empty.
 *
 * @param {String} fileName the name of the file
 * @param {Function} [map] Optional map function, called once for each row (header row skipped). Has signature `(row, i)`. See example below.
 * @param {Function} callback callback used when read data is read, takes error (if any) and the data read
 *
 * @example
 * io.readDbf('path/to/data.dbf', function (err, data) {
 *   console.log(data) // Json data
 * })
 *
 * io.readDbf('path/to/data.dbf', function (row, i) {
 *   row.height = row.height * 2
 *   return row
 * },
 * function (err, data) {
 *   console.log(data) // Json data with height value doubled
 * })
 */
readers.readDbf = function (path, opts_, cb) {
  var parserOptions = {
    map: function (d) { return d }
  }
  if (typeof cb === 'undefined') {
    cb = opts_
  } else {
    parserOptions = _.isFunction(opts_) ? {map: opts_} : opts_
  }
  var reader = shapefileDbf.reader(path)
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
        if (record === shapefileDbf.end) {
          return callback(null)
        }
        var jsonRecord = _.object(headers, record)
        rows.push(parserOptions.map(jsonRecord, rows.length))
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

// Used internally by `readdir` functions to make more DRY
function readdir (modeInfo, dirPath, opts_, cb) {
  opts_ = opts_ || {}
  var isAsync = modeInfo.async

  // Convert to array if a string
  opts_.include = strToArray(opts_.include)
  opts_.exclude = strToArray(opts_.exclude)

  // Set defaults if not provided
  opts_.includeMatchAll = (opts_.includeMatchAll) ? 'every' : 'some'
  opts_.excludeMatchAll = (opts_.excludeMatchAll) ? 'every' : 'some'

  if (isAsync === true) {
    fs.readdir(dirPath, function (err, files) {
      if (err) {
        throw err
      }
      filter(files, cb)
    })
  } else {
    return filterSync(fs.readdirSync(dirPath))
  }

  function strToArray (val) {
    if (val && !_.isArray(val)) {
      val = [val]
    }
    return val
  }

  function filterByType (file, cb) {
    var filePath = (opts_.fullPath) ? file : path.join(dirPath, file)
    if (isAsync === true) {
      fs.stat(filePath, function (err, stats) {
        var filtered = getFiltered(stats.isDirectory())
        cb(err, filtered)
      })
    } else {
      return getFiltered(fs.statSync(filePath).isDirectory())
    }

    function getFiltered (isDir) {
      if (opts_.skipDirectories) {
        if (isDir) {
          return false
        }
      }
      if (opts_.skipFiles) {
        if (!isDir) {
          return false
        }
      }
      return file
    }
  }

  function filterByMatchers (files) {
    var filtered = files.filter(function (fileName) {
      var isExcluded
      var isIncluded

      // Don't include if matches exclusion matcher
      if (opts_.exclude) {
        isExcluded = opts_.exclude[opts_.excludeMatchAll](function (matcher) {
          return helpers.matches(fileName, matcher)
        })
        if (isExcluded === true) {
          return false
        }
      }

      // Include if matches inclusion matcher, exclude if it doesn't
      if (opts_.include) {
        isIncluded = opts_.include[opts_.includeMatchAll](function (matcher) {
          return helpers.matches(fileName, matcher)
        })
        return isIncluded
      }

      // Return true if it makes it to here
      return true
    })

    // Prefix with the full path if that's what we asked for
    if (opts_.fullPath === true) {
      filtered = filtered.map(function (fileName) {
        return path.join(dirPath, fileName)
      })
    }

    return filtered
  }

  function filterSync (files) {
    var filtered = filterByMatchers(files)

    return filtered.map(function (file) {
      return filterByType(file)
    }).filter(_.identity)
  }

  function filter (files, cb) {
    var filterQ = queue()

    var filtered = filterByMatchers(files)

    filtered.forEach(function (fileName) {
      filterQ.defer(filterByType, fileName)
    })

    filterQ.awaitAll(function (err, namesOfType) {
      cb(err, namesOfType.filter(_.identity))
    })
  }
}

/**
  * Functions to write data files.
  * @namespace
*/
var writers = {}

/**
 * Write the data object, inferring the file format from the file ending specified in `fileName`.
 *
 * Supported formats:
 *
 * * `.json` Array of objects, also supports `.geojson` and `.topojson`
 * * `.csv` Comma-separated
 * * `.tsv` Tab-separated
 * * `.psv` Pipe-separated
 * * `.yaml` Yaml file, also supports `.yml`
 * * `.dbf` Database file, commonly used in ESRI-shapefile format.
 *
 * @param {String} fileName the name of the file
 * @param {Object} data the data to write
 * @param {Object} [options] Optional config object, see below
 * @param {Boolean} [options.makeDirectories=false] If true, create intermediate directories to your data file.
 * @param {Function|Array} [options.replacer] Used for JSON formats. Filter your objects before writing. Examples below. See JSON.stringify docs for more info https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
 * @param {Number} [options.indent] Used for JSON and YAML formats. Specifies indent level. Default for YAML is `2`, `0` for JSON.
 * @param {String} [options.writeMethod='safeDump'] Used for YAML formats. Can also be `"dump"` to allow writing of RegExes and functions. The `options` object will also pass anything onto `js-yaml`. See its docs for other options. Example shown below with `sortKeys`. https://github.com/nodeca/js-yaml#safedump-object---options-
 * @param {Array} [options.columns] Used for tabular formats. Optionally specify a list of column names to use. Otherwise they are detected from the data. See `d3-dsv` for more detail: https://github.com/d3/d3-dsv/blob/master/README.md#dsv_format
 * @param {Function} callback callback of `(err, dataString)` where `err` is any error and `dataString` is the data that was written out as a string
 *
 * @example
 * io.writeData('path/to/data.json', jsonData, function (err, dataString) {
 *   console.log(err)
 * })
 *
 * io.writeData('path/to/create/to/data.csv', flatJsonData, {makeDirectories: true}, function (err, dataString) {
 *   console.log(err)
 * })
 *
 * io.writeData('path/to/to/data.yaml', jsonData, {writeMehod: "dump", sortKeys: true}, function (err, dataString) {
 *   console.log(err)
 * })
 *
 * io.writeData('path/to/to/data.json', jsonData, {indent: 4}, function (err, dataString) {
 *   console.log(err)
 * })
 *
 * io.writeData('path/to/to/data.json', jsonData, {
 *   indent: 4,
 *   replacer: function (key, value) {
 *     // Filtering out string properties
 *     if (typeof value === "string") {
 *       return undefined
 *     }
 *     return value
 *   }
 * }, function (err, dataString) {
 *   console.log(err)
 * })
 *
 * io.writeData('path/to/to/data.json', jsonData, {
 *   indent: 4,
 *   replacer: ['name', 'occupation'] // Only keep "name" and "occupation" values
 * }, function (err, dataString) {
 *   console.log(err)
 * })
 */
writers.writeData = function (outPath, data, opts_, cb) {
  if (typeof cb === 'undefined') {
    cb = opts_
    opts_ = undefined
  }
  if (!data) {
    reporters.warn('You didn\'t pass any data to write for file: ' + chalk.bold(outPath) + ' Writing out an empty file...')
  }

  if (_.isObject(opts_) && opts_.makeDirectories) {
    delete opts_.makeDirectories
    helpers.makeDirectories(outPath, proceed)
  } else {
    proceed()
  }

  function proceed (err) {
    if (err) {
      throw err
    }

    var writeOptions
    if (!_.isFunction(opts_)) {
      writeOptions = opts_
    }

    var fileFormatter = helpers.discernFileFormatter(outPath)
    var formattedData = fileFormatter(data, writeOptions)
    fs.writeFile(outPath, formattedData, function (err) {
      cb(err, formattedData)
    })
  }
}

/**
 * Syncronous version of {@link writers#writeData}
 *
 * Supports the same formats with the exception of `.dbf` files
 *
 * @param {String} fileName the name of the file
 * @param {Object} [options] Optional config object, see below
 * @param {Boolean} [options.makeDirectories=false] If true, create intermediate directories to your data file.
 * @param {Function|Array} [options.replacer] Used for JSON formats. Filter your objects before writing. Examples below. See JSON.stringify docs for more info https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
 * @param {Number} [options.indent] Used for JSON and YAML formats. Specifies indent level. Default for YAML is `2`, `0` for JSON.
 * @param {String} [options.writeMethod='safeDump'] Used for YAML formats. Can also be `"dump"` to allow writing of RegExes and functions. The `options` object will also pass anything onto `js-yaml`. See its docs for other options. Example shown below with `sortKeys`. https://github.com/nodeca/js-yaml#safedump-object---options-
 * @param {Array} [options.columns] Used for tabular formats. Optionally specify a list of column names to use. Otherwise they are detected from the data. See `d3-dsv` for more detail: https://github.com/d3/d3-dsv/blob/master/README.md#dsv_format
 * @param {Object} data the data to write
 * @returns {String} the data string that was written
 *
 * @example
 * io.writeDataSync('path/to/data.json', jsonData)
 *
 * io.writeDataSync('path/to/create/to/data.csv', flatJsonData, {makeDirectories: true})
 *
 * io.writeDataSync('path/to/to/data.yaml', jsonData, {writeMehod: "dump", sortKeys: true})
 *
 * io.writeDataSync('path/to/to/data.json', jsonData, {indent: 4})
 *
 * io.writeDataSync('path/to/to/data.json', jsonData, {
 *   indent: 4,
 *   replacer: function (key, value) {
 *     // Filtering out string properties
 *     if (typeof value === "string") {
 *       return undefined
 *     }
 *     return value
 *   }
 * })
 *
 * io.writeDataSync('path/to/to/data.json', jsonData, {
 *   indent: 4,
 *   replacer: ['name', 'occupation'] // Only keep "name" and "occupation" values
 * })
 */
writers.writeDataSync = function (outPath, data, opts_) {
  if (_.isEmpty(data)) {
    reporters.warn('You didn\'t pass any data to write for file: ' + chalk.bold(outPath) + ' Writing out an empty file...')
  }
  var writeOptions
  if (_.isObject(opts_)) {
    if (opts_.makeDirectories) {
      helpers.makeDirectoriesSync(outPath)
    }
    delete opts_.makeDirectories
    writeOptions = opts_
  }
  var fileFormatter = helpers.discernFileFormatter(outPath)
  var formattedData = fileFormatter(data, writeOptions)
  fs.writeFileSync(outPath, formattedData)
  return formattedData
}

/**
 * Append to an existing data object, creating a new file if one does not exist. If appending to an object, data is extended with `_.extend`. For tabular formats (csv, tsv, etc), existing data and new data must be an array of flat objects (cannot contain nested objects or arrays).
 *
 * Supported formats:
 *
 * * `.json` Array of objects
 * * `.csv` Comma-separated
 * * `.tsv` Tab-separated
 * * `.psv` Pipe-separated
 * * `.yaml` or `.yml` Yaml
 *
 * *Note: Does not currently support .dbf files.*
 *
 * @param {String} fileName the name of the file
 * @param {Object} data the data to write
 * @param {Object} [options] Optional config object, see below
 * @param {Boolean} [options.makeDirectories=false] If true, create intermediate directories to your data file.
 * @param {Function} callback callback of `(err, data)` where `err` is any error and `data` is the data that was written out
 *
 * @example
 * io.appendData('path/to/data.json', jsonData, function (err) {
 *   console.log(err)
 * })
 *
 * io.appendData('path/to/create/to/data.csv', flatJsonData, {makeDirectories: true}, function (err){
 *   console.log(err)
 * })
 */
writers.appendData = function (outPath, data, opts_, cb) {
  if (typeof cb === 'undefined') {
    cb = opts_
  }
  if (_.isObject(opts_) && opts_.makeDirectories) {
    helpers.makeDirectories(outPath, proceed)
  } else {
    proceed()
  }
  function proceed (err) {
    if (err) {
      throw err
    }
    // Run append file to delegate creating a new file if none exists
    fs.appendFile(outPath, '', function (err) {
      if (!err) {
        readers.readData(outPath, function (err, existingData) {
          if (!err) {
            if (!_.isEmpty(existingData)) {
              if (_.isArray(existingData)) {
                data = existingData.concat(data)
              } else if (_.isObject(existingData)) {
                data = _.extend({}, existingData, data)
              }
            }
            writers.writeData(outPath, data, opts_, cb)
          } else {
            cb(err)
          }
        })
      } else {
        cb(err)
      }
    })
  }
}

/**
 * Synchronous version of {@link writers#appendData}. See that function for supported formats
 *
 * @param {String} fileName the name of the file
 * @param {Object} [options] Optional config object, see below
 * @param {Boolean} [options.makeDirectories=false] If true, create intermediate directories to your data file.
 * @param {Object} data the data to write
 * @returns {Object} the data that was written
 *
 * @example
 * io.appendDataSync('path/to/data.json', jsonData)
 *
 * io.appendDataSync('path/to/create/to/data.csv', flatJsonData, {makeDirectories: true})
 */
writers.appendDataSync = function (outPath, data, opts_) {
  // Run append file to delegate creating a new file if none exists
  if (opts_ && opts_.makeDirectories) {
    helpers.makeDirectoriesSync(outPath)
  }
  fs.appendFileSync(outPath, '')
  var existingData = readers.readDataSync(outPath)
  if (!_.isEmpty(existingData)) {
    if (_.isArray(existingData)) {
      data = existingData.concat(data)
    } else if (_.isObject(existingData)) {
      data = _.extend({}, existingData, data)
    }
  }
  writers.writeDataSync(outPath, data, opts_)
  return data
}

/**
  * Functions that both read and write.
  * @namespace
*/
var converters = {}

/**
 * Reads in a dbf file with `.readDbf` and write to file using `.writeData`. A convenience function for converting DBFs to more useable formats. Formerly known as `writeDbfToData` and is aliased for legacy support.
 *
 * @param {String} inFileName the input file name
 * @param {String} outFileName the output file name
 * @param {Object} [options] Optional config object, see below
 * @param {Boolean} [options.makeDirectories=false] If true, create intermediate directories to your data file.
 * @param {Function} callback callback that takes error (if any)
 *
 * @example
 * io.convertDbfToData('path/to/data.dbf', 'path/to/data.csv', function (err) {
 *   console.log(err)
 * })
 *
 * io.convertDbfToData('path/to/data.dbf', 'path/to/create/to/data.csv', {makeDirectories: true}, function (err) {
 *   console.log(err)
 * })
 */
converters.convertDbfToData = function (inPath, outPath, opts_, cb) {
  if (typeof cb === 'undefined') {
    cb = opts_
  }
  readers.readDbf(inPath, function (error, jsonData) {
    if (error) {
      cb(error)
    } else {
      writers.writeData(outPath, jsonData, opts_, cb)
    }
  })
}

module.exports = _.extend({}, {parsers: parsers}, {formatters: formatters}, readers, shorthandReaders, writers, converters, helpers, { fs: fs })
