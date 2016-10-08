/* global describe, it */

var path = require('path')
var io = require('../lib/index')
var chai = require('chai')
var assert = chai.assert
var _ = require('underscore')
var rimraf = require('rimraf')

function testDataPath (name) {
  return path.join(__dirname, 'data', name)
}

function assertBasicValid (json, strings) {
  var values = strings ? ['70', '63'] : [70, 63]

  assert.lengthOf(json, 2)
  assert.typeOf(json[0], 'object')
  assert(_.isEqual(_.keys(json[0]), ['name', 'occupation', 'height']), 'headers match keys')
  assert(_.isEqual(_.keys(json[1]), ['name', 'occupation', 'height']), 'headers match keys')
  assert(_.isEqual(_.values(json[0]), ['jim', 'land surveyor', values[0]]), 'data values match values')
  assert(_.isEqual(_.values(json[1]), ['francis', 'conductor', values[1]]), 'data values match values')
}

describe('discernFormat()', function () {
  describe('no extension', function () {
    it('should be false', function () {
      assert.equal(io.discernFormat('/fake/path/what_is_this_file'), false)
    })
  })

  describe('csv', function () {
    it('should properly discern csv format', function () {
      assert.equal(io.discernFormat(testDataPath('csv/empty.csv')), 'csv')
    })
  })

  describe('tsv', function () {
    it('should properly discern tsv format', function () {
      assert.equal(io.discernFormat(testDataPath('tsv/empty.tsv')), 'tsv')
    })
  })

  describe('psv', function () {
    it('should properly discern psv format', function () {
      assert.equal(io.discernFormat(testDataPath('psv/empty.psv')), 'psv')
    })
  })

  describe('yaml', function () {
    it('should properly discern yaml format', function () {
      assert.equal(io.discernFormat(testDataPath('yaml/empty.yaml')), 'yaml')
    })
  })

  describe('yml', function () {
    it('should properly discern yml format', function () {
      assert.equal(io.discernFormat(testDataPath('yml/empty.yml')), 'yml')
    })
  })

  describe('txt', function () {
    it('should properly discern txt format', function () {
      assert.equal(io.discernFormat(testDataPath('txt/empty.txt')), 'txt')
    })
  })

  describe('dbf', function () {
    it('should properly discern dbf format', function () {
      assert.equal(io.discernFormat(testDataPath('dbf/empty.dbf')), 'dbf')
    })
  })

  describe('aml', function () {
    it('should properly discern aml format', function () {
      assert.equal(io.discernFormat(testDataPath('aml/empty.aml')), 'aml')
    })
  })

  describe('json', function () {
    it('should properly discern json format', function () {
      assert.equal(io.discernFormat(testDataPath('json/empty.json')), 'json')
    })
  })

  describe('geojson', function () {
    it('should properly discern geojson format', function () {
      assert.equal(io.discernFormat(testDataPath('geojson/empty.geojson')), 'geojson')
    })
  })

  describe('topojson', function () {
    it('should properly discern topojson format', function () {
      assert.equal(io.discernFormat(testDataPath('topojson/empty.topojson')), 'topojson')
    })
  })
})

describe('discernParser()', function () {
  describe('no extension', function () {
    it('should be text parser', function () {
      assert.equal(io.discernParser('/fake/path/what_is_this_file').toString(), io.parsers.txt.toString())
    })
  })

  describe('csv', function () {
    it('should be csv parser', function () {
      assert.equal(io.discernParser(testDataPath('csv/empty.csv')).toString(), io.parsers.csv.toString())
    })
  })

  describe('tsv', function () {
    it('should be tsv parser', function () {
      assert.equal(io.discernParser(testDataPath('tsv/empty.tsv')).toString(), io.parsers.tsv.toString())
    })
  })

  describe('psv', function () {
    it('should be psv parser', function () {
      assert.equal(io.discernParser(testDataPath('psv/empty.psv')).toString(), io.parsers.psv.toString())
    })
  })

  describe('yaml', function () {
    it('should be yaml parser', function () {
      assert.equal(io.discernParser(testDataPath('yaml/empty.yaml')).toString(), io.parsers.yaml.toString())
    })
  })

  describe('yml', function () {
    it('should be yml parser', function () {
      assert.equal(io.discernParser(testDataPath('yml/empty.yml')).toString(), io.parsers.yml.toString())
    })
  })

  describe('txt', function () {
    it('should be txt parser', function () {
      assert.equal(io.discernParser(testDataPath('txt/empty.txt')).toString(), io.parsers.txt.toString())
    })
  })

  describe('aml', function () {
    it('should be aml parser', function () {
      assert.equal(io.discernParser(testDataPath('aml/empty.aml')).toString(), io.parsers.aml.toString())
    })
  })

  describe('json', function () {
    it('should be json parser', function () {
      assert.equal(io.discernParser(testDataPath('json/empty.json')).toString(), io.parsers.json.toString())
    })
  })

  describe('geojson', function () {
    it('should be geojson parser', function () {
      assert.equal(io.discernParser(testDataPath('geojson/empty.geojson')).toString(), io.parsers.geojson.toString())
    })
  })

  describe('topojson', function () {
    it('should be topojson parser', function () {
      assert.equal(io.discernParser(testDataPath('topojson/empty.topojson')).toString(), io.parsers.topojson.toString())
    })
  })
})

describe('discernFileFormatter()', function () {
  describe('no extension', function () {
    it('should be text formatter', function () {
      assert.equal(io.discernFileFormatter('/fake/path/what_is_this_file').toString(), io.formatters.txt.toString())
    })
  })

  describe('csv', function () {
    it('should be csv formatter', function () {
      assert.equal(io.discernFileFormatter(testDataPath('csv/empty.csv')).toString(), io.formatters.csv.toString())
    })
  })

  describe('tsv', function () {
    it('should be tsv formatter', function () {
      assert.equal(io.discernFileFormatter(testDataPath('tsv/empty.tsv')).toString(), io.formatters.tsv.toString())
    })
  })

  describe('psv', function () {
    it('should be psv formatter', function () {
      assert.equal(io.discernFileFormatter(testDataPath('psv/empty.psv')).toString(), io.formatters.psv.toString())
    })
  })

  describe('yaml', function () {
    it('should be yaml formatter', function () {
      assert.equal(io.discernFileFormatter(testDataPath('yaml/empty.yaml')).toString(), io.formatters.yaml.toString())
    })
  })

  describe('yml', function () {
    it('should be yml formatter', function () {
      assert.equal(io.discernFileFormatter(testDataPath('yml/empty.yml')).toString(), io.formatters.yml.toString())
    })
  })

  describe('txt', function () {
    it('should be txt formatter', function () {
      assert.equal(io.discernFileFormatter(testDataPath('txt/empty.txt')).toString(), io.formatters.txt.toString())
    })
  })

  describe('json', function () {
    it('should be json formatter', function () {
      assert.equal(io.discernFileFormatter(testDataPath('json/empty.json')).toString(), io.formatters.json.toString())
    })
  })

  describe('geojson', function () {
    it('should be geojson formatter', function () {
      assert.equal(io.discernFileFormatter(testDataPath('geojson/empty.geojson')).toString(), io.formatters.geojson.toString())
    })
  })

  describe('topojson', function () {
    it('should be topojson formatter', function () {
      assert.equal(io.discernFileFormatter(testDataPath('topojson/empty.topojson')).toString(), io.formatters.topojson.toString())
    })
  })
})

describe('existsSync()', function () {
  var dir = path.join(__dirname, 'data', 'csv')
  describe('exists', function () {
    it('should be true', function () {
      var exists = io.existsSync(path.join(dir, 'basic.csv'))
      assert.equal(exists, true)
    })
  })
  describe('does not exist', function () {
    it('should be false', function () {
      var exists = io.existsSync(path.join(dir, 'doesnt-exist.csv'))
      assert.equal(exists, false)
    })
  })
})

// TODO, how would one test for an error in stat'ing the file?
describe('exists()', function () {
  describe('exists', function () {
    it('should be true', function (done) {
      io.exists(testDataPath('csv/basic.csv'), function (err, exists) {
        if (err) {
          console.error(err)
        }
        assert.equal(exists, true)
        done()
      })
    })
  })
  describe('does not exist', function () {
    it('should be false', function (done) {
      io.exists(testDataPath('csv/doesnt-exist.csv'), function (err, exists) {
        if (err) {
          console.error(err)
        }
        assert.equal(exists, false)
        done()
      })
    })
  })
})

describe('makeDirectories()', function () {
  it('should make multiple directories', function (done) {
    var filePath = ['test', 'tmp-md', 'one', 'two', 'three', 'file.txt']
    io.makeDirectories(filePath.join(path.sep), function (err) {
      assert.equal(err, null)
      filePath.pop()
      assert.equal(io.existsSync(filePath.join(path.sep)), true)
      rimraf(filePath.slice(0, 2).join(path.sep), {glob: false}, function (err) {
        assert.equal(err, null)
        done()
      })
    })
  })
})

describe('makeDirectoriesSync()', function () {
  it('should make multiple directories', function (done) {
    var filePath = ['test', 'tmp-mds', 'one', 'two', 'three', 'file.txt']
    io.makeDirectoriesSync(filePath.join(path.sep))
    filePath.pop()
    assert.equal(io.existsSync(filePath.join(path.sep)), true)
    rimraf(filePath.slice(0, 2).join(path.sep), {glob: false}, function (err) {
      assert.equal(err, null)
      done()
    })
  })
})

describe('extensionMatches()', function () {
  it('should match the given extension', function () {
    assert.equal(io.extensionMatches(testDataPath('csv/basic.csv'), 'csv'), true)
  })

  it('should not match the given extension', function () {
    assert.equal(io.extensionMatches(testDataPath('csv/basic.csv'), 'tsv'), false)
  })

  it('should match no extension', function () {
    assert.equal(io.extensionMatches(testDataPath('csv/basic'), ''), true)
  })
})

// matchRegExp
// matches

describe('extend()', function () {
  describe('shallow', function () {
    it('should be equal', function () {
      var mergedObj = io.extend({}, {name: 'indian-ocean'}, {alias: 'io'})
      assert.equal(JSON.stringify(mergedObj), JSON.stringify({name: 'indian-ocean', alias: 'io'}))
    })
  })

  describe('deep', function () {
    it('should be equal', function () {
      var object1 = {
        apple: 0,
        banana: { weight: 52, price: 100 },
        cherry: 97
      }
      var object2 = {
        banana: { price: 200 },
        almond: 100
      }
      io.extend(true, object1, object2)

      var desiredResult = {
        apple: 0,
        banana: {
          weight: 52,
          price: 200
        },
        cherry: 97,
        almond: 100
      }

      assert.equal(JSON.stringify(object1), JSON.stringify(desiredResult))
    })
  })
})

describe('deepExtend()', function () {
  describe('deep', function () {
    it('should be equal', function () {
      var object1 = {
        apple: 0,
        banana: { weight: 52, price: 100 },
        cherry: 97
      }
      var object2 = {
        banana: { price: 200 },
        almond: 100
      }
      io.deepExtend(object1, object2)

      var desiredResult = {
        apple: 0,
        banana: {
          weight: 52,
          price: 200
        },
        cherry: 97,
        almond: 100
      }

      assert.equal(JSON.stringify(object1), JSON.stringify(desiredResult))
    })
  })
})

describe('readDataSync()', function () {
  describe('csv', function () {
    it('should match expected json', function () {
      var json = io.readDataSync(testDataPath('csv/basic.csv'))
      assertBasicValid(json, true)
    })
  })

  describe('json', function () {
    it('should match expected json', function () {
      var json = io.readDataSync(testDataPath('json/basic.json'))
      assertBasicValid(json)
    })
  })

  describe('psv', function () {
    it('should match expected json', function () {
      var json = io.readDataSync(testDataPath('psv/basic.psv'))
      assertBasicValid(json, true)
    })
  })

  describe('tsv', function () {
    it('should match expected json', function () {
      var json = io.readDataSync(testDataPath('tsv/basic.tsv'))
      assertBasicValid(json, true)
    })
  })

  describe('txt', function () {
    it('should match expected txt', function () {
      var txt = io.readDataSync(testDataPath('other/this_is_not_a_csv.txt'))
      assert(_.isEqual('But will it look like one?\nBut will it look like one?\n', txt))
    })
  })

  describe('unknown ext', function () {
    it('should match expected text', function () {
      var txt = io.readDataSync(testDataPath('other/fancy-text-extension.text'))
      assert(_.isEqual(txt, 'The carbon in our apple pies billions upon billions cosmos. Extraplanetary Hypatia. Tendrils of gossamer clouds? Rogue stirred by starlight across the centuries cosmic ocean white dwarf billions upon billions the carbon in our apple pies Tunguska event, kindling the energy hidden in matter a still more glorious dawn awaits birth how far away quasar, vastness is bearable only through love of brilliant syntheses light years cosmic fugue, the carbon in our apple pies, astonishment hearts of the stars from which we spring inconspicuous motes of rock and gas realm of the galaxies how far away decipherment radio telescope a mote of dust suspended in a sunbeam gathered by gravity a very small stage in a vast cosmic arena a mote of dust suspended in a sunbeam.'))
    })
  })

  describe('yaml', function () {
    it('should match expected json', function () {
      var json = io.readDataSync(testDataPath('yaml/basic.yaml'))
      assert(_.isEqual('{"name":"jim","occupation":"land surveyor","height":70}', JSON.stringify(json)))
    })
  })

  describe('yml', function () {
    it('should match expected json', function () {
      var json = io.readDataSync(testDataPath('yml/basic.yml'))
      assert(_.isEqual('{"name":"jim","occupation":"land surveyor","height":70}', JSON.stringify(json)))
    })
  })

  describe('aml', function () {
    it('should match expected json', function () {
      var json = io.readDataSync(testDataPath('aml/basic.aml'))
      assert(_.isEqual('{"text":[{"type":"text","value":"I can type words here..."},{"type":"text","value":"And separate them into different paragraphs without tags."}]}', JSON.stringify(json)))
    })
  })
})

describe('readJsonSync()', function () {
  describe('empty', function () {
    it('should be empty', function () {
      assert.lengthOf(io.readJsonSync(testDataPath('json/empty.json')), 0)
    })
  })

  describe('basic', function () {
    it('should match expected json', function () {
      var json = io.readJsonSync(testDataPath('json/basic.json'))
      assertBasicValid(json)
    })
  })

  describe('basic', function () {
    it('should use readOptions', function () {
      var json = io.readJsonSync(testDataPath('json/basic.json'), {
        readOptions: {
          reviver: function (k, v) {
            if (typeof v === 'number') {
              return v * 2
            }
            return v
          }
        }
      })
      assert(_.isEqual(JSON.stringify(json), '[{"name":"jim","occupation":"land surveyor","height":140},{"name":"francis","occupation":"conductor","height":126}]'))
    })
  })

  describe('invalid', function () {
    it('should raise an error', function () {
      assert.throws(function () {
        io.readJsonSync(testDataPath('json/invalid.json'))
      }, Error)
    })
  })
})

describe('readCsvSync()', function () {
  describe('empty', function () {
    it('should be empty', function () {
      assert.lengthOf(io.readCsvSync(testDataPath('csv/empty.csv')), 0)
    })
  })

  describe('basic', function () {
    it('should match expected json', function () {
      var json = io.readCsvSync(testDataPath('csv/basic.csv'))
      assertBasicValid(json, true)
    })
  })

  describe('basic casted', function () {
    it('should match expected json', function () {
      var json = io.readCsvSync(testDataPath('csv/basic.csv'), {
        readOptions: function (row, i, columns) {
          row.height = +row.height
          return row
        }
      })
      assertBasicValid(json)
    })
  })
})

describe('readPsvSync()', function () {
  describe('empty', function () {
    it('should be empty', function () {
      assert.lengthOf(io.readPsvSync(testDataPath('psv/empty.psv')), 0)
    })
  })

  describe('basic', function () {
    it('should match expected json', function () {
      var json = io.readPsvSync(testDataPath('psv/basic.psv'))
      assertBasicValid(json, true)
    })
  })
})

describe('readTsvSync()', function () {
  describe('empty', function () {
    it('should be empty', function () {
      assert.lengthOf(io.readTsvSync(testDataPath('tsv/empty.tsv')), 0)
    })
  })

  describe('basic', function () {
    it('should match expected json', function () {
      var json = io.readTsvSync(testDataPath('tsv/basic.tsv'))
      assertBasicValid(json, true)
    })
  })
})

describe('readTxtSync()', function () {
  describe('empty', function () {
    it('should be empty', function () {
      assert.lengthOf(io.readTxtSync(testDataPath('txt/empty.txt')), 0)
    })
  })

  describe('basic', function () {
    it('should match expected json', function () {
      var txt = io.readTxtSync(testDataPath('txt/basic.txt'))
      assert(_.isEqual(txt, 'The carbon in our apple pies billions upon billions cosmos. Extraplanetary Hypatia. Tendrils of gossamer clouds? Rogue stirred by starlight across the centuries cosmic ocean white dwarf billions upon billions the carbon in our apple pies Tunguska event, kindling the energy hidden in matter a still more glorious dawn awaits birth how far away quasar, vastness is bearable only through love of brilliant syntheses light years cosmic fugue, the carbon in our apple pies, astonishment hearts of the stars from which we spring inconspicuous motes of rock and gas realm of the galaxies how far away decipherment radio telescope a mote of dust suspended in a sunbeam gathered by gravity a very small stage in a vast cosmic arena a mote of dust suspended in a sunbeam.'))
    })
  })
})

describe('readYamlSync()', function () {
  describe('empty yaml', function () {
    it('should be empty', function () {
      var json = io.readYamlSync(testDataPath('yaml/empty.yaml'))
      assert(_.isUndefined(json))
    })
  })

  describe('basic yaml', function () {
    it('should match expected json', function () {
      var json = io.readYamlSync(testDataPath('yaml/basic.yaml'))
      assert(_.isEqual(JSON.stringify(json), '{"name":"jim","occupation":"land surveyor","height":70}'))
    })
  })

  describe('empty yml', function () {
    it('should be empty', function () {
      var json = io.readYamlSync(testDataPath('yml/empty.yml'))
      assert(_.isUndefined(json))
    })
  })

  describe('basic yml', function () {
    it('should match expected json', function () {
      var json = io.readYamlSync(testDataPath('yml/basic.yml'))
      assert(_.isEqual(JSON.stringify(json), '{"name":"jim","occupation":"land surveyor","height":70}'))
    })
  })
})

describe('readAmlSync()', function () {
  describe('empty', function () {
    it('should be empty', function () {
      var json = io.readAmlSync(testDataPath('aml/empty.aml'))
      assert(_.isEmpty(json))
    })
  })

  describe('basic', function () {
    it('should match expected json', function () {
      var json = io.readAmlSync(testDataPath('aml/basic.aml'))
      assert(_.isEqual(JSON.stringify(json), '{"text":[{"type":"text","value":"I can type words here..."},{"type":"text","value":"And separate them into different paragraphs without tags."}]}'))
    })
  })
})

describe('readdirFilter()', function () {
  describe('empty', function () {
    it('should be empty', function (done) {
      io.readdirFilter(__dirname, {include: 'csv'}, function (err, files) {
        assert.lengthOf(files, 0)
        if (err) {
          console.error(err)
        }
        done()
      })
    })
  })

  describe('no options passed', function () {
    it('should match expected output', function (done) {
      var dir = path.join(__dirname, 'data', 'csv')
      io.readdirFilter(dir, function (err, files) {
        assert(_.isEqual(files.length, 2))
        if (err) {
          console.error(err)
        }
        done()
      })
    })
  })

  describe('include by extension', function () {
    it('should match expected output', function (done) {
      var dir = path.join(__dirname, 'data', 'csv')
      io.readdirFilter(dir, {include: 'csv'}, function (err, files) {
        assert(_.isEqual(files.length, 2))
        if (err) {
          console.error(err)
        }
        done()
      })
    })
  })

  describe('include by single list', function () {
    it('should match expected output', function (done) {
      var dir = path.join(__dirname, 'data', 'csv')
      io.readdirFilter(dir, {include: ['csv']}, function (err, files) {
        assert(_.isEqual(files.length, 2))
        if (err) {
          console.error(err)
        }
        done()
      })
    })
  })

  describe('include by extension list', function () {
    it('should match expected output', function (done) {
      var dir = path.join(__dirname, 'data', 'mixed')
      io.readdirFilter(dir, {include: ['csv', 'tsv']}, function (err, files) {
        assert(_.isEqual(JSON.stringify(files), '["data-0.csv","data-0.tsv","data-1.csv"]'))
        if (err) {
          console.error(err)
        }
        done()
      })
    })
  })

  describe('include by extension list and regex', function () {
    it('should match expected output', function (done) {
      var dir = path.join(__dirname, 'data', 'mixed')
      io.readdirFilter(dir, {include: ['csv', 'tsv', /hidden/]}, function (err, files) {
        assert(_.isEqual(JSON.stringify(files), '[".hidden-file","data-0.csv","data-0.tsv","data-1.csv"]'))
        if (err) {
          console.error(err)
        }
        done()
      })
    })
  })

  describe('dirPath in filename', function () {
    it('should match expected output', function (done) {
      var dir = path.join(__dirname, 'data', 'csv')
      io.readdirFilter(dir, {include: 'csv', fullPath: true}, function (err, files) {
        if (err) {
          console.error(err)
        }
        done(assert.equal(files.indexOf(path.join(dir, 'basic.csv')), 0))
      })
    })
  })

  describe('all files match', function () {
    it('should be empty', function (done) {
      var dir = path.join(__dirname, 'data', 'csv')
      io.readdirFilter(dir, {exclude: 'csv'}, function (err, files) {
        assert.lengthOf(files, 0)
        if (err) {
          console.error(err)
        }
        done()
      })
    })
  })

  describe('exclude by extension', function () {
    it('should match expected out', function (done) {
      var dir = path.join(__dirname, 'data', 'mixed')
      io.readdirFilter(dir, {exclude: 'tsv'}, function (err, files) {
        assert(_.isEqual(JSON.stringify(files), '[".hidden-file","data-0.csv","data-0.json","data-1.csv","data-1.json"]'))
        if (err) {
          console.error(err)
        }
        done()
      })
    })
  })

  describe('exclude by extension list', function () {
    it('match expected output', function (done) {
      var dir = path.join(__dirname, 'data', 'mixed')
      io.readdirFilter(dir, {exclude: ['tsv', 'csv']}, function (err, files) {
        assert(_.isEqual(JSON.stringify(files), '[".hidden-file","data-0.json","data-1.json"]'))
        if (err) {
          console.error(err)
        }
        done()
      })
    })
  })

  describe('include and exclude by regex and extension list', function () {
    it('match expected output', function (done) {
      var dir = path.join(__dirname, 'data', 'mixed')
      io.readdirFilter(dir, {exclude: ['tsv', 'csv'], include: /^data/}, function (err, files) {
        assert(_.isEqual(JSON.stringify(files), '["data-0.json","data-1.json"]'))
        if (err) {
          console.error(err)
        }
        done()
      })
    })
  })

  describe('includeMatchAll', function () {
    it('match expected output', function (done) {
      var dir = path.join(__dirname, 'data', 'mixed')
      io.readdirFilter(dir, {include: [/^data-1/, 'json'], includeMatchAll: true}, function (err, files) {
        assert(_.isEqual(JSON.stringify(files), '["data-1.json"]'))
        if (err) {
          console.error(err)
        }
        done()
      })
    })
  })

  describe('excludeMatchAll', function () {
    it('match expected output', function (done) {
      var dir = path.join(__dirname, 'data', 'mixed')
      io.readdirFilter(dir, {exclude: [/^data-1/, 'json'], excludeMatchAll: true}, function (err, files) {
        assert(_.isEqual(JSON.stringify(files), '[".hidden-file","data-0.csv","data-0.json","data-0.tsv","data-1.csv"]'))
        if (err) {
          console.error(err)
        }
        done()
      })
    })
  })

  describe('exclude by extension list and regex', function () {
    it('match expected output', function (done) {
      var dir = path.join(__dirname, 'data', 'mixed')
      io.readdirFilter(dir, {exclude: ['tsv', 'csv', /^\./]}, function (err, files) {
        assert(_.isEqual(JSON.stringify(files), '["data-0.json","data-1.json"]'))
        if (err) {
          console.error(err)
        }
        done()
      })
    })
  })

  describe('dirPath in filename', function () {
    it('should match expected output', function (done) {
      var dir = path.join(__dirname, 'data', 'other')
      io.readdirFilter(dir, {exclude: 'csv', fullPath: true}, function (err, files) {
        if (err) {
          console.error(err)
        }
        done(assert.notEqual(files.indexOf(path.join(dir, 'this_is_not_a_csv.txt')), -1))
      })
    })
  })

  describe('get dirs only', function () {
    it('should match expected output', function (done) {
      var dir = path.join(__dirname, 'data', 'mixed-dirs')
      io.readdirFilter(dir, {skipFiles: true}, function (err, files) {
        assert(_.isEqual(JSON.stringify(files), '["sub-dir-0","sub-dir-1","sub-dir-2"]'))
        if (err) {
          console.error(err)
        }
        done()
      })
    })
  })

  describe('get files only', function () {
    it('should match expected output', function (done) {
      var dir = path.join(__dirname, 'data', 'mixed-dirs')
      io.readdirFilter(dir, {exclude: /^\./, skipDirectories: true}, function (err, files) {
        assert(_.isEqual(JSON.stringify(files), '["data-0.csv","data-0.json","data-0.tsv","data-1.csv","data-1.json"]'))
        if (err) {
          console.error(err)
        }
        done()
      })
    })
  })
})

describe('readdirFilterSync()', function () {
  describe('empty', function () {
    it('should be empty', function () {
      assert.lengthOf(io.readdirFilterSync(__dirname, {include: 'csv'}), 0)
    })
  })

  describe('actual extension', function () {
    it('should not be empty', function () {
      var dir = path.join(__dirname, 'data', 'csv')
      assert.isAbove(io.readdirFilterSync(dir, {include: 'csv'}).length, 0)
    })
  })

  describe('extension in filename', function () {
    it('should be empty', function () {
      var dir = path.join(__dirname, 'data', 'json')
      assert.lengthOf(io.readdirFilterSync(dir, {include: 'csv'}), 0)
    })
  })

  describe('dirPath in filename', function () {
    it('should match expected output', function () {
      var dir = path.join(__dirname, 'data', 'csv')
      var files = io.readdirFilterSync(dir, {include: 'csv', fullPath: true})
      assert.equal(files.indexOf(path.join(dir, 'basic.csv')), 0)
    })
  })

  describe('use regex', function () {
    it('should match expected output', function () {
      var dir = path.join(__dirname, 'data', 'mixed')
      var files = io.readdirFilterSync(dir, {include: /\.*/})
      assert.notEqual(files.indexOf('.hidden-file'), -1)
    })
  })
})

describe('readdirFilterSync()', function () {
  describe('all files match', function () {
    it('should be empty', function () {
      var dir = path.join(__dirname, 'data', 'csv')
      assert.lengthOf(io.readdirFilterSync(dir, {exclude: 'csv'}), 0)
    })
  })

  describe('no matching files', function () {
    it('should not be empty', function () {
      var dir = path.join(__dirname, 'data', 'csv')
      assert.isAbove(io.readdirFilterSync(dir, {exclude: 'tsv'}).length, 0)
    })
  })

  describe('extension in filename', function () {
    it('should not be empty', function () {
      var dir = path.join(__dirname, 'data', 'mixed')
      assert.isAbove(io.readdirFilterSync(dir, {exclude: 'csv'}).length, 0)
    })
  })

  describe('dirPath in filename', function () {
    it('should match expected output', function () {
      var dir = path.join(__dirname, 'data', 'other')
      var files = io.readdirFilterSync(dir, {exclude: 'csv', fullPath: true})
      assert.notEqual(files.indexOf(path.join(dir, 'this_is_not_a_csv.txt')), -1)
    })
  })

  describe('get dirs only', function () {
    it('should match expected output', function () {
      var dir = path.join(__dirname, 'data', 'mixed-dirs')
      var files = io.readdirFilterSync(dir, {skipFiles: true})
      assert(_.isEqual(JSON.stringify(files), '["sub-dir-0","sub-dir-1","sub-dir-2"]'))
    })
  })

  describe('get files only', function () {
    it('should match expected output', function () {
      var dir = path.join(__dirname, 'data', 'mixed-dirs')
      var files = io.readdirFilterSync(dir, {exclude: /^\./, skipDirectories: true})
      assert(_.isEqual(JSON.stringify(files), '["data-0.csv","data-0.json","data-0.tsv","data-1.csv","data-1.json"]'))
    })
  })
})
