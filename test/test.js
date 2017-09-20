/* global describe, it */

var fs = require('fs')
var path = require('path')
var io = require('../dist/indian-ocean.node.js')
var chai = require('chai')
var assert = chai.assert
var dsv = require('d3-dsv')
var _ = require('underscore')
var rimraf = require('rimraf')
var glob = require('glob')

// Get rid of all these before testing
glob.sync('test/**/.DS_Store').forEach(function (dsStore) {
  fs.unlinkSync(dsStore)
})

var testData = [
  { 'name': 'jim', 'occupation': 'land surveyor', 'height': 70 },
  { 'name': 'francis', 'occupation': 'conductor', 'height': 63 }
]

function testDataPath (name) {
  return path.join(__dirname, 'data', name)
}

function readAssertBasicValid (path, columns) {
  var strFormats = ['json', 'geojson', 'topojson', 'yml', 'yaml']
  var strings = strFormats.indexOf(io.discernFormat(path)) === -1
  var json = io.readDataSync(path)
  assertBasicValid(json, strings, columns)
}

function readAssertBasicValidObject (path, row) {
  var strFormats = ['json', 'geojson', 'topojson', 'yml', 'yaml']
  var strings = strFormats.indexOf(io.discernFormat(path)) === -1
  var json = io.readDataSync(path)
  assertBasicValidObject(json, strings, row)
}

function assertBasicValid (json, strings, columns) {
  var values = strings ? ['70', '63'] : [70, 63]

  columns = columns || ['name', 'occupation', 'height']

  assert.lengthOf(json, 2)
  assert.typeOf(json[0], 'object')
  assert(_.isEqual(_.keys(json[0]), columns), 'headers match keys')
  assert(_.isEqual(_.keys(json[1]), columns), 'headers match keys')
  assert(_.isEqual(_.values(json[0]), ['jim', 'land surveyor', values[0]]), 'data values match values')
  assert(_.isEqual(_.values(json[1]), ['francis', 'conductor', values[1]]), 'data values match values')
}

function assertBasicValidObject (obj, strings, row) {
  var values = strings ? ['70', '63'] : [70, 63]
  assert.typeOf(obj, 'object')
  assert(_.isEqual(_.keys(obj), ['name', 'occupation', 'height']), 'headers match keys')
  if (row === undefined || row === 0) {
    assert(_.isEqual(_.values(obj), ['jim', 'land surveyor', values[0]]), 'data values match values')
  } else if (row === 1) {
    assert(_.isEqual(_.values(obj), ['francis', 'conductor', values[1]]), 'data values match values')
  }
}

function removeWhiteSpace (str) {
  return str.replace(/\s/g, '')
}

describe('discernFormat()', function () {
  describe('no extension', function () {
    it('should be false', function () {
      assert.equal(io.discernFormat('/fake/path/what_is_this_file'), false)
    })
    it('should be false for dotfiles', function () {
      assert.equal(io.discernFormat('/fake/path/.gitignore'), false)
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

    it('should be text parser as method', function () {
      assert.equal(io.discernParser('/fake/path/what_is_this_file').toString(), io.parseTxt.toString())
    })
  })

  describe('csv', function () {
    it('should be csv parser', function () {
      assert.equal(io.discernParser(testDataPath('csv/empty.csv')).toString(), io.parsers.csv.toString())
    })

    it('should be csv parser as method', function () {
      assert.equal(io.discernParser(testDataPath('csv/empty.csv')).toString(), io.parseCsv.toString())
    })
  })

  describe('tsv', function () {
    it('should be tsv parser', function () {
      assert.equal(io.discernParser(testDataPath('tsv/empty.tsv')).toString(), io.parsers.tsv.toString())
    })

    it('should be tsv parser as method', function () {
      assert.equal(io.discernParser(testDataPath('tsv/empty.tsv')).toString(), io.parseTsv.toString())
    })
  })

  describe('psv', function () {
    it('should be psv parser', function () {
      assert.equal(io.discernParser(testDataPath('psv/empty.psv')).toString(), io.parsers.psv.toString())
    })

    it('should be psv parser as method', function () {
      assert.equal(io.discernParser(testDataPath('psv/empty.psv')).toString(), io.parsePsv.toString())
    })
  })

  describe('yaml', function () {
    it('should be yaml parser', function () {
      assert.equal(io.discernParser(testDataPath('yaml/empty.yaml')).toString(), io.parsers.yaml.toString())
    })

    it('should be yaml parser as method', function () {
      assert.equal(io.discernParser(testDataPath('yaml/empty.yaml')).toString(), io.parseYaml.toString())
    })
  })

  describe('yml', function () {
    it('should be yml parser', function () {
      assert.equal(io.discernParser(testDataPath('yml/empty.yml')).toString(), io.parsers.yml.toString())
    })

    it('should be yml parser as method', function () {
      assert.equal(io.discernParser(testDataPath('yml/empty.yml')).toString(), io.parseYaml.toString())
    })
  })

  describe('txt', function () {
    it('should be txt parser', function () {
      assert.equal(io.discernParser(testDataPath('txt/empty.txt')).toString(), io.parsers.txt.toString())
    })

    it('should be txt parser as method', function () {
      assert.equal(io.discernParser(testDataPath('txt/empty.txt')).toString(), io.parseTxt.toString())
    })
  })

  describe('aml', function () {
    it('should be aml parser', function () {
      assert.equal(io.discernParser(testDataPath('aml/empty.aml')).toString(), io.parsers.aml.toString())
    })

    it('should be aml parser as method', function () {
      assert.equal(io.discernParser(testDataPath('aml/empty.aml')).toString(), io.parseAml.toString())
    })
  })

  describe('json', function () {
    it('should be json parser', function () {
      assert.equal(io.discernParser(testDataPath('json/empty.json')).toString(), io.parsers.json.toString())
    })

    it('should be json parser as method', function () {
      assert.equal(io.discernParser(testDataPath('json/empty.json')).toString(), io.parseJson.toString())
    })
  })

  describe('geojson', function () {
    it('should be geojson parser', function () {
      assert.equal(io.discernParser(testDataPath('geojson/empty.geojson')).toString(), io.parsers.geojson.toString())
    })

    it('should be geojson parser as method', function () {
      assert.equal(io.discernParser(testDataPath('geojson/empty.geojson')).toString(), io.parseJson.toString())
    })
  })

  describe('topojson', function () {
    it('should be topojson parser', function () {
      assert.equal(io.discernParser(testDataPath('topojson/empty.topojson')).toString(), io.parsers.topojson.toString())
    })

    it('should be topojson parser as method', function () {
      assert.equal(io.discernParser(testDataPath('topojson/empty.topojson')).toString(), io.parseJson.toString())
    })
  })

  describe('custom delimiter: `_`', function () {
    it('should be custom parser', function () {
      assert.equal(removeWhiteSpace(io.discernParser(null, '_').toString()), removeWhiteSpace(dsv.dsvFormat('_').parse.toString()))
    })
  })
})

describe('discernFileFormatter()', function () {
  describe('no extension', function () {
    it('should be text formatter', function () {
      assert.equal(io.discernFileFormatter('/fake/path/what_is_this_file').toString(), io.formatters.txt.toString())
    })

    it('should be text formatter as method', function () {
      assert.equal(io.discernFileFormatter('/fake/path/what_is_this_file').toString(), io.formatTxt.toString())
    })
  })

  describe('csv', function () {
    it('should be csv formatter', function () {
      assert.equal(io.discernFileFormatter(testDataPath('csv/empty.csv')).toString(), io.formatters.csv.toString())
    })

    it('should be csv formatter as method', function () {
      assert.equal(io.discernFileFormatter(testDataPath('csv/empty.csv')).toString(), io.formatCsv.toString())
    })
  })

  describe('tsv', function () {
    it('should be tsv formatter', function () {
      assert.equal(io.discernFileFormatter(testDataPath('tsv/empty.tsv')).toString(), io.formatters.tsv.toString())
    })

    it('should be tsv formatter as method', function () {
      assert.equal(io.discernFileFormatter(testDataPath('tsv/empty.tsv')).toString(), io.formatTsv.toString())
    })
  })

  describe('psv', function () {
    it('should be psv formatter', function () {
      assert.equal(io.discernFileFormatter(testDataPath('psv/empty.psv')).toString(), io.formatters.psv.toString())
    })

    it('should be psv formatter as method', function () {
      assert.equal(io.discernFileFormatter(testDataPath('psv/empty.psv')).toString(), io.formatPsv.toString())
    })
  })

  describe('yaml', function () {
    it('should be yaml formatter', function () {
      assert.equal(io.discernFileFormatter(testDataPath('yaml/empty.yaml')).toString(), io.formatters.yaml.toString())
    })

    it('should be yaml formatter as method', function () {
      assert.equal(io.discernFileFormatter(testDataPath('yaml/empty.yaml')).toString(), io.formatYaml.toString())
    })
  })

  describe('yml', function () {
    it('should be yml formatter', function () {
      assert.equal(io.discernFileFormatter(testDataPath('yml/empty.yml')).toString(), io.formatters.yml.toString())
    })

    it('should be yml formatter as method', function () {
      assert.equal(io.discernFileFormatter(testDataPath('yml/empty.yml')).toString(), io.formatYaml.toString())
    })
  })

  describe('txt', function () {
    it('should be txt formatter', function () {
      assert.equal(io.discernFileFormatter(testDataPath('txt/empty.txt')).toString(), io.formatters.txt.toString())
    })

    it('should be txt formatter as method', function () {
      assert.equal(io.discernFileFormatter(testDataPath('txt/empty.txt')).toString(), io.formatTxt.toString())
    })
  })

  describe('json', function () {
    it('should be json formatter', function () {
      assert.equal(io.discernFileFormatter(testDataPath('json/empty.json')).toString(), io.formatters.json.toString())
    })

    it('should be json formatter as method', function () {
      assert.equal(io.discernFileFormatter(testDataPath('json/empty.json')).toString(), io.formatJson.toString())
    })
  })

  describe('geojson', function () {
    it('should be geojson formatter', function () {
      assert.equal(io.discernFileFormatter(testDataPath('geojson/empty.geojson')).toString(), io.formatters.geojson.toString())
    })

    it('should be geojson formatter as method', function () {
      assert.equal(io.discernFileFormatter(testDataPath('geojson/empty.geojson')).toString(), io.formatJson.toString())
    })
  })

  describe('topojson', function () {
    it('should be topojson formatter', function () {
      assert.equal(io.discernFileFormatter(testDataPath('topojson/empty.topojson')).toString(), io.formatters.topojson.toString())
    })

    it('should be topojson formatter as method', function () {
      assert.equal(io.discernFileFormatter(testDataPath('topojson/empty.topojson')).toString(), io.formatJson.toString())
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
        assert.equal(err, null)
        assert.equal(exists, true)
        done()
      })
    })
  })
  describe('does not exist', function () {
    it('should be false', function (done) {
      io.exists(testDataPath('csv/doesnt-exist.csv'), function (err, exists) {
        assert.equal(err, null)
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

describe('extMatchesStr()', function () {
  it('should match the given extension', function () {
    assert.equal(io.extMatchesStr('csv/basic.csv', 'csv'), true)
  })

  it('should not match the given extension', function () {
    assert.equal(io.extMatchesStr('csv/basic.csv', 'tsv'), false)
  })

  it('should match no extension', function () {
    assert.equal(io.extMatchesStr('csv/basic', ''), true)
  })

  it('should match dotfile', function () {
    assert.equal(io.extMatchesStr('csv/basic/.gitignore', ''), true)
  })
})

describe('matchesRegExp()', function () {
  it('should match the regex with a dotfile', function () {
    assert.equal(io.matchesRegExp('.gitignore', /\.gitignore/), true)
  })

  it('should match the regex with a normal file', function () {
    assert.equal(io.matchesRegExp('data.csv', /\.csv$/), true)
  })

  it('should not match the regex', function () {
    assert.equal(io.matchesRegExp('.gitignore', /csv/), false)
  })

  it('should match the full path', function () {
    assert.equal(io.matchesRegExp('path/to/file/basic.csv', /\/file\//), true)
  })
})

describe('matches()', function () {
  describe('string', function () {
    it('should match string name', function () {
      assert.equal(io.matches('path/to/data.csv', 'csv'), true)
    })
  })

  describe('regex', function () {
    it('should match regex name', function () {
      assert.equal(io.matches('path/to/data.csv', /csv$/), true)
    })
  })
})

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

describe('readers', function () {
  describe('readDataSync()', function () {
    describe('json', function () {
      it('should match expected json', function () {
        var json = io.readDataSync(testDataPath('json/basic.json'))
        assertBasicValid(json)
      })
    })

    describe('json with map', function () {
      it('should match expected json', function () {
        var json = io.readDataSync(testDataPath('json/basic.json'), {
          map: function (row, i) {
            row.height = row.height * 2
            return row
          }
        })
        assert(_.isEqual(JSON.stringify(json), '[{"name":"jim","occupation":"land surveyor","height":140},{"name":"francis","occupation":"conductor","height":126}]'))
      })
    })

    describe('json with map', function () {
      it('should match expected geojson', function () {
        var json = io.readDataSync(testDataPath('geojson/basic.geojson'), {
          map: function (row, i) {
            row.height = row.height * 2
            return row
          }
        })
        assert(_.isEqual(JSON.stringify(json), '[{"name":"jim","occupation":"land surveyor","height":140},{"name":"francis","occupation":"conductor","height":126}]'))
      })
    })

    describe('json with map', function () {
      it('should match expected topojson', function () {
        var json = io.readDataSync(testDataPath('topojson/basic.topojson'), {
          map: function (row, i) {
            row.height = row.height * 2
            return row
          }
        })
        assert(_.isEqual(JSON.stringify(json), '[{"name":"jim","occupation":"land surveyor","height":140},{"name":"francis","occupation":"conductor","height":126}]'))
      })
    })

    describe('json object', function () {
      it('should match expected json', function () {
        var json = io.readDataSync(testDataPath('json-object/basic.json'))
        assert(_.isEqual(JSON.stringify(json), '{"name":"jim","occupation":"land surveyor","height":70}'))
      })
    })

    describe('json object with map', function () {
      it('should match expected json', function () {
        var json = io.readDataSync(testDataPath('json-object/basic.json'), {
          map: function (value, key) {
            if (typeof value === 'number') {
              return value * 2
            }
            return value
          }
        })
        assert(_.isEqual(JSON.stringify(json), '{"name":"jim","occupation":"land surveyor","height":140}'))
      })
    })

    describe('json object with reviver', function () {
      it('should match expected json', function () {
        var json = io.readDataSync(testDataPath('json-object/basic.json'), {
          reviver: function (key, value) {
            if (typeof value === 'number') {
              return value * 2
            }
            return value
          }
        })
        assert(_.isEqual(JSON.stringify(json), '{"name":"jim","occupation":"land surveyor","height":140}'))
      })
    })

    describe('json with reviver', function () {
      it('should match expected json', function () {
        var json = io.readDataSync(testDataPath('json/basic.json'), {
          reviver: function (key, value) {
            if (typeof value === 'number') {
              return value * 2
            }
            return value
          }
        })
        assert(_.isEqual(JSON.stringify(json), '[{"name":"jim","occupation":"land surveyor","height":140},{"name":"francis","occupation":"conductor","height":126}]'))
      })
    })

    describe('json with map shorthand', function () {
      it('should match expected json', function () {
        var json = io.readDataSync(testDataPath('json/basic.json'), function (row, i) {
          row.height = row.height * 2
          return row
        })
        assert(_.isEqual(JSON.stringify(json), '[{"name":"jim","occupation":"land surveyor","height":140},{"name":"francis","occupation":"conductor","height":126}]'))
      })
    })

    describe('json object with map shorthand', function () {
      it('should match expected json', function () {
        var json = io.readDataSync(testDataPath('json-object/basic.json'), function (value, key) {
          if (typeof value === 'number') {
            return value * 2
          }
          return value
        })
        assert(_.isEqual(JSON.stringify(json), '{"name":"jim","occupation":"land surveyor","height":140}'))
      })
    })

    describe('csv', function () {
      it('should match expected json', function () {
        var json = io.readDataSync(testDataPath('csv/basic.csv'))
        assertBasicValid(json, true)
      })
    })

    describe('csv with map', function () {
      it('should match expected json', function () {
        var json = io.readDataSync(testDataPath('csv/basic.csv'), {
          map: function (row, i, columns) {
            row.height = +row.height
            return row
          }
        })
        assertBasicValid(json)
      })
    })

    describe('csv with map shorthand', function () {
      it('should match expected json', function () {
        var json = io.readDataSync(testDataPath('csv/basic.csv'), function (row, i, columns) {
          row.height = +row.height
          return row
        })
        assertBasicValid(json)
      })
    })

    describe('psv', function () {
      it('should match expected json', function () {
        var json = io.readDataSync(testDataPath('psv/basic.psv'))
        assertBasicValid(json, true)
      })
    })

    describe('psv with map', function () {
      it('should match expected json', function () {
        var json = io.readDataSync(testDataPath('psv/basic.psv'), {
          map: function (row, i, columns) {
            row.height = +row.height
            return row
          }
        })
        assertBasicValid(json)
      })
    })

    describe('psv with map shorthand', function () {
      it('should match expected json', function () {
        var json = io.readDataSync(testDataPath('psv/basic.psv'), function (row, i, columns) {
          row.height = +row.height
          return row
        })
        assertBasicValid(json)
      })
    })

    describe('tsv', function () {
      it('should match expected json', function () {
        var json = io.readDataSync(testDataPath('tsv/basic.tsv'))
        assertBasicValid(json, true)
      })
    })

    describe('tsv with map', function () {
      it('should match expected json', function () {
        var json = io.readDataSync(testDataPath('tsv/basic.tsv'), {
          map: function (row, i, columns) {
            row.height = +row.height
            return row
          }
        })
        assertBasicValid(json)
      })
    })

    describe('tsv with map shorthand', function () {
      it('should match expected json', function () {
        var json = io.readDataSync(testDataPath('tsv/basic.tsv'), function (row, i, columns) {
          row.height = +row.height
          return row
        })
        assertBasicValid(json)
      })
    })

    describe('txt', function () {
      it('should match expected txt', function () {
        var txt = io.readDataSync(testDataPath('txt/basic.txt'))
        assert(_.isEqual('The carbon in our apple pies billions upon billions cosmos. Extraplanetary Hypatia. Tendrils of gossamer clouds? Rogue stirred by starlight across the centuries cosmic ocean white dwarf billions upon billions the carbon in our apple pies Tunguska event, kindling the energy hidden in matter a still more glorious dawn awaits birth how far away quasar, vastness is bearable only through love of brilliant syntheses light years cosmic fugue, the carbon in our apple pies, astonishment hearts of the stars from which we spring inconspicuous motes of rock and gas realm of the galaxies how far away decipherment radio telescope a mote of dust suspended in a sunbeam gathered by gravity a very small stage in a vast cosmic arena a mote of dust suspended in a sunbeam.', txt))
      })
    })

    describe('txt with map', function () {
      it('should match expected txt', function () {
        var txt = io.readDataSync(testDataPath('txt/basic.txt'), {
          map: function (str) {
            return str.replace(/carbon/g, 'diamonds')
          }
        })
        assert(_.isEqual(txt, 'The diamonds in our apple pies billions upon billions cosmos. Extraplanetary Hypatia. Tendrils of gossamer clouds? Rogue stirred by starlight across the centuries cosmic ocean white dwarf billions upon billions the diamonds in our apple pies Tunguska event, kindling the energy hidden in matter a still more glorious dawn awaits birth how far away quasar, vastness is bearable only through love of brilliant syntheses light years cosmic fugue, the diamonds in our apple pies, astonishment hearts of the stars from which we spring inconspicuous motes of rock and gas realm of the galaxies how far away decipherment radio telescope a mote of dust suspended in a sunbeam gathered by gravity a very small stage in a vast cosmic arena a mote of dust suspended in a sunbeam.'))
      })
    })

    describe('txt with map shorthand', function () {
      it('should match expected txt', function () {
        var txt = io.readDataSync(testDataPath('txt/basic.txt'), function (str) {
          return str.replace(/carbon/g, 'diamonds')
        })
        assert(_.isEqual(txt, 'The diamonds in our apple pies billions upon billions cosmos. Extraplanetary Hypatia. Tendrils of gossamer clouds? Rogue stirred by starlight across the centuries cosmic ocean white dwarf billions upon billions the diamonds in our apple pies Tunguska event, kindling the energy hidden in matter a still more glorious dawn awaits birth how far away quasar, vastness is bearable only through love of brilliant syntheses light years cosmic fugue, the diamonds in our apple pies, astonishment hearts of the stars from which we spring inconspicuous motes of rock and gas realm of the galaxies how far away decipherment radio telescope a mote of dust suspended in a sunbeam gathered by gravity a very small stage in a vast cosmic arena a mote of dust suspended in a sunbeam.'))
      })
    })

    describe('text', function () {
      it('should match expected text', function () {
        var txt = io.readDataSync(testDataPath('text/basic.text'))
        assert(_.isEqual('The carbon in our apple pies billions upon billions cosmos. Extraplanetary Hypatia. Tendrils of gossamer clouds? Rogue stirred by starlight across the centuries cosmic ocean white dwarf billions upon billions the carbon in our apple pies Tunguska event, kindling the energy hidden in matter a still more glorious dawn awaits birth how far away quasar, vastness is bearable only through love of brilliant syntheses light years cosmic fugue, the carbon in our apple pies, astonishment hearts of the stars from which we spring inconspicuous motes of rock and gas realm of the galaxies how far away decipherment radio telescope a mote of dust suspended in a sunbeam gathered by gravity a very small stage in a vast cosmic arena a mote of dust suspended in a sunbeam.', txt))
      })
    })

    describe('text with map', function () {
      it('should match expected text', function () {
        var txt = io.readDataSync(testDataPath('text/basic.text'), {
          map: function (str) {
            return str.replace(/carbon/g, 'diamonds')
          }
        })
        assert(_.isEqual(txt, 'The diamonds in our apple pies billions upon billions cosmos. Extraplanetary Hypatia. Tendrils of gossamer clouds? Rogue stirred by starlight across the centuries cosmic ocean white dwarf billions upon billions the diamonds in our apple pies Tunguska event, kindling the energy hidden in matter a still more glorious dawn awaits birth how far away quasar, vastness is bearable only through love of brilliant syntheses light years cosmic fugue, the diamonds in our apple pies, astonishment hearts of the stars from which we spring inconspicuous motes of rock and gas realm of the galaxies how far away decipherment radio telescope a mote of dust suspended in a sunbeam gathered by gravity a very small stage in a vast cosmic arena a mote of dust suspended in a sunbeam.'))
      })
    })

    describe('text with map shorthand', function () {
      it('should match expected text', function () {
        var txt = io.readDataSync(testDataPath('text/basic.text'), function (str) {
          return str.replace(/carbon/g, 'diamonds')
        })
        assert(_.isEqual(txt, 'The diamonds in our apple pies billions upon billions cosmos. Extraplanetary Hypatia. Tendrils of gossamer clouds? Rogue stirred by starlight across the centuries cosmic ocean white dwarf billions upon billions the diamonds in our apple pies Tunguska event, kindling the energy hidden in matter a still more glorious dawn awaits birth how far away quasar, vastness is bearable only through love of brilliant syntheses light years cosmic fugue, the diamonds in our apple pies, astonishment hearts of the stars from which we spring inconspicuous motes of rock and gas realm of the galaxies how far away decipherment radio telescope a mote of dust suspended in a sunbeam gathered by gravity a very small stage in a vast cosmic arena a mote of dust suspended in a sunbeam.'))
      })
    })

    describe('yaml', function () {
      it('should match expected json', function () {
        var json = io.readDataSync(testDataPath('yaml/basic.yaml'))
        assert(_.isEqual(JSON.stringify(json), '{"name":"jim","occupation":"land surveyor","height":70}'))
      })
    })

    describe('yaml with map', function () {
      it('should match expected json', function () {
        var json = io.readDataSync(testDataPath('yaml/basic.yaml'), {
          map: function (yamlFile) {
            yamlFile.height = yamlFile.height * 2
            return yamlFile
          }
        })
        assert(_.isEqual(JSON.stringify(json), '{"name":"jim","occupation":"land surveyor","height":140}'))
      })
    })

    describe('yaml with map shorthand', function () {
      it('should match expected json', function () {
        var json = io.readDataSync(testDataPath('yaml/basic.yaml'), function (yamlFile) {
          yamlFile.height = yamlFile.height * 2
          return yamlFile
        })
        assert(_.isEqual(JSON.stringify(json), '{"name":"jim","occupation":"land surveyor","height":140}'))
      })
    })

    describe('yml', function () {
      it('should match expected json', function () {
        var json = io.readDataSync(testDataPath('yml/basic.yml'))
        assert(_.isEqual(JSON.stringify(json), '{"name":"jim","occupation":"land surveyor","height":70}'))
      })
    })

    describe('yml with map', function () {
      it('should match expected json', function () {
        var json = io.readDataSync(testDataPath('yml/basic.yml'), {
          map: function (yamlFile) {
            yamlFile.height = yamlFile.height * 2
            return yamlFile
          }
        })
        assert(_.isEqual(JSON.stringify(json), '{"name":"jim","occupation":"land surveyor","height":140}'))
      })
    })

    describe('yml with map shorthand', function () {
      it('should match expected json', function () {
        var json = io.readDataSync(testDataPath('yml/basic.yml'), function (yamlFile) {
          yamlFile.height = yamlFile.height * 2
          return yamlFile
        })
        assert(_.isEqual(JSON.stringify(json), '{"name":"jim","occupation":"land surveyor","height":140}'))
      })
    })

    describe('aml', function () {
      it('should match expected json', function () {
        var json = io.readDataSync(testDataPath('aml/basic.aml'))
        assert(_.isEqual(JSON.stringify(json), '{"text":[{"type":"text","value":"I can type words here..."},{"type":"text","value":"And separate them into different paragraphs without tags."}]}'))
      })
    })

    describe('aml with map', function () {
      it('should match expected json', function () {
        var json = io.readDataSync(testDataPath('aml/basic.aml'), {
          map: function (yamlFile) {
            yamlFile.text = 'hey'
            return yamlFile
          }
        })
        assert(_.isEqual(JSON.stringify(json), '{"text":"hey"}'))
      })
    })

    describe('aml with map shorthand', function () {
      it('should match expected json', function () {
        var json = io.readDataSync(testDataPath('aml/basic.aml'), function (yamlFile) {
          yamlFile.text = 'hey'
          return yamlFile
        })
        assert(_.isEqual(JSON.stringify(json), '{"text":"hey"}'))
      })
    })

    describe('custom delimiter string: `_`', function () {
      it('should match expected json', function () {
        var json = io.readDataSync(testDataPath('other/basic.usv'), {parser: '_'})
        assertBasicValid(json, true)
      })
    })

    describe('custom delimiter fn with map', function () {
      it('should match expected json', function () {
        var json = io.readDataSync(testDataPath('other/basic.usv'), {
          parser: function (str, parserOptions) {
            return dsv.dsvFormat('_').parse(str, parserOptions.map)
          },
          map: function (row, i, columns) {
            row.height = row.height * 2
            return row
          }
        })
        assert(_.isEqual(JSON.stringify(json), '[{"name":"jim","occupation":"land surveyor","height":140},{"name":"francis","occupation":"conductor","height":126}]'))
      })
    })

    describe('custom delimiter parse fn: dsv.dsvFormat(\'_\').parse', function () {
      it('should match expected json', function () {
        var json = io.readDataSync(testDataPath('other/basic.usv'), {parser: dsv.dsvFormat('_').parse})
        assertBasicValid(json, true)
      })
    })

    describe('custom delimiter object: dsv.dsvFormat(\'_\')', function () {
      it('should match expected json', function () {
        var json = io.readDataSync(testDataPath('other/basic.usv'), {parser: dsv.dsvFormat('_')})
        assertBasicValid(json, true)
      })
    })

    describe('custom delimiter fn', function () {
      it('should match expected json', function () {
        var json = io.readDataSync(testDataPath('json/basic.json'), {parser: function (str) { return JSON.parse(str) }})
        assertBasicValid(json)
      })
    })

    describe('unknown ext', function () {
      it('should match expected text', function () {
        var txt = io.readDataSync(testDataPath('other/fancy-text-extension.text'))
        assert(_.isEqual(txt, 'The carbon in our apple pies billions upon billions cosmos. Extraplanetary Hypatia. Tendrils of gossamer clouds? Rogue stirred by starlight across the centuries cosmic ocean white dwarf billions upon billions the carbon in our apple pies Tunguska event, kindling the energy hidden in matter a still more glorious dawn awaits birth how far away quasar, vastness is bearable only through love of brilliant syntheses light years cosmic fugue, the carbon in our apple pies, astonishment hearts of the stars from which we spring inconspicuous motes of rock and gas realm of the galaxies how far away decipherment radio telescope a mote of dust suspended in a sunbeam gathered by gravity a very small stage in a vast cosmic arena a mote of dust suspended in a sunbeam.'))
      })
    })
  })

  describe('readData()', function () {
    describe('json', function () {
      it('should match expected json', function (done) {
        io.readData(testDataPath('json/basic.json'), function (err, json) {
          assert.equal(err, null)
          assertBasicValid(json)
          done()
        })
      })

      it('should match expected geojson', function (done) {
        io.readData(testDataPath('geojson/basic.geojson'), function (err, json) {
          assert.equal(err, null)
          assertBasicValid(json)
          done()
        })
      })

      it('should match expected topojson', function (done) {
        io.readData(testDataPath('topojson/basic.topojson'), function (err, json) {
          assert.equal(err, null)
          assertBasicValid(json)
          done()
        })
      })

      it('should match expected json', function (done) {
        io.readData(testDataPath('json/basic.json'), {
          map: function (row, i) {
            row.height = row.height * 2
            return row
          }
        }, function (err, json) {
          assert.equal(err, null)
          assert(_.isEqual(JSON.stringify(json), '[{"name":"jim","occupation":"land surveyor","height":140},{"name":"francis","occupation":"conductor","height":126}]'))
          done()
        })
      })
    })

    describe('json object', function () {
      it('should match expected json', function (done) {
        io.readData(testDataPath('json-object/basic.json'), function (err, json) {
          assert.equal(err, null)
          assert(_.isEqual(JSON.stringify(json), '{"name":"jim","occupation":"land surveyor","height":70}'))
          done()
        })
      })
    })

    describe('json object with map', function () {
      it('should match expected json', function (done) {
        io.readData(testDataPath('json-object/basic.json'), {
          map: function (value, key) {
            if (typeof value === 'number') {
              return value * 2
            }
            return value
          }
        }, function (err, json) {
          assert.equal(err, null)
          assert(_.isEqual(JSON.stringify(json), '{"name":"jim","occupation":"land surveyor","height":140}'))
          done()
        })
      })
    })

    describe('json object with reviver', function () {
      it('should match expected json', function (done) {
        io.readData(testDataPath('json-object/basic.json'), {
          reviver: function (key, value) {
            if (typeof value === 'number') {
              return value * 2
            }
            return value
          }
        }, function (err, json) {
          assert.equal(err, null)
          assert(_.isEqual(JSON.stringify(json), '{"name":"jim","occupation":"land surveyor","height":140}'))
          done()
        })
      })
    })

    describe('json with reviver', function () {
      it('should match expected json', function (done) {
        io.readData(testDataPath('json/basic.json'), {
          reviver: function (key, value) {
            if (typeof value === 'number') {
              return value * 2
            }
            return value
          }
        }, function (err, json) {
          assert.equal(err, null)
          assert(_.isEqual(JSON.stringify(json), '[{"name":"jim","occupation":"land surveyor","height":140},{"name":"francis","occupation":"conductor","height":126}]'))
          done()
        })
      })
    })

    describe('json with map shorthand', function () {
      it('should match expected json', function (done) {
        io.readData(testDataPath('json/basic.json'), function (row, i) {
          row.height = row.height * 2
          return row
        }, function (err, json) {
          assert.equal(err, null)
          assert(_.isEqual(JSON.stringify(json), '[{"name":"jim","occupation":"land surveyor","height":140},{"name":"francis","occupation":"conductor","height":126}]'))
          done()
        })
      })
    })

    describe('json object with map shorthand', function () {
      it('should match expected json', function (done) {
        io.readData(testDataPath('json-object/basic.json'), function (value, key) {
          if (typeof value === 'number') {
            return value * 2
          }
          return value
        }, function (err, json) {
          assert.equal(err, null)
          assert(_.isEqual(JSON.stringify(json), '{"name":"jim","occupation":"land surveyor","height":140}'))
          done()
        })
      })
    })

    describe('csv', function () {
      it('should match expected json', function (done) {
        io.readData(testDataPath('csv/basic.csv'), function (err, json) {
          assert.equal(err, null)
          assertBasicValid(json, true)
          done()
        })
      })
    })

    describe('csv with map', function () {
      it('should match expected json', function (done) {
        io.readData(testDataPath('csv/basic.csv'), {
          map: function (row, i, columns) {
            row.height = +row.height
            return row
          }
        }, function (err, json) {
          assert.equal(err, null)
          assertBasicValid(json)
          done()
        })
      })
    })

    describe('csv with map shorthand', function () {
      it('should match expected json', function (done) {
        io.readData(testDataPath('csv/basic.csv'), function (row, i, columns) {
          row.height = +row.height
          return row
        }, function (err, json) {
          assert.equal(err, null)
          assertBasicValid(json)
          done()
        })
      })
    })

    describe('psv', function () {
      it('should match expected json', function (done) {
        io.readData(testDataPath('psv/basic.psv'), function (err, json) {
          assert.equal(err, null)
          assertBasicValid(json, true)
          done()
        })
      })
    })

    describe('psv with map', function () {
      it('should match expected json', function (done) {
        io.readData(testDataPath('psv/basic.psv'), {
          map: function (row, i, columns) {
            row.height = +row.height
            return row
          }
        }, function (err, json) {
          assert.equal(err, null)
          assertBasicValid(json)
          done()
        })
      })
    })

    describe('psv with map shorthand', function () {
      it('should match expected json', function (done) {
        io.readData(testDataPath('psv/basic.psv'), function (row, i, columns) {
          row.height = +row.height
          return row
        }, function (err, json) {
          assert.equal(err, null)
          assertBasicValid(json)
          done()
        })
      })
    })

    describe('tsv', function () {
      it('should match expected json', function (done) {
        io.readData(testDataPath('tsv/basic.tsv'), function (err, json) {
          assert.equal(err, null)
          assertBasicValid(json, true)
          done()
        })
      })
    })

    describe('tsv with map', function () {
      it('should match expected json', function (done) {
        io.readData(testDataPath('tsv/basic.tsv'), {
          map: function (row, i, columns) {
            row.height = +row.height
            return row
          }
        }, function (err, json) {
          assert.equal(err, null)
          assertBasicValid(json)
          done()
        })
      })
    })

    describe('tsv with map shorthand', function () {
      it('should match expected json', function (done) {
        io.readData(testDataPath('tsv/basic.tsv'), function (row, i, columns) {
          row.height = +row.height
          return row
        }, function (err, json) {
          assert.equal(err, null)
          assertBasicValid(json)
          done()
        })
      })
    })

    describe('txt', function () {
      it('should match expected txt', function (done) {
        io.readData(testDataPath('txt/basic.txt'), function (err, txt) {
          assert.equal(err, null)
          assert(_.isEqual(txt, 'The carbon in our apple pies billions upon billions cosmos. Extraplanetary Hypatia. Tendrils of gossamer clouds? Rogue stirred by starlight across the centuries cosmic ocean white dwarf billions upon billions the carbon in our apple pies Tunguska event, kindling the energy hidden in matter a still more glorious dawn awaits birth how far away quasar, vastness is bearable only through love of brilliant syntheses light years cosmic fugue, the carbon in our apple pies, astonishment hearts of the stars from which we spring inconspicuous motes of rock and gas realm of the galaxies how far away decipherment radio telescope a mote of dust suspended in a sunbeam gathered by gravity a very small stage in a vast cosmic arena a mote of dust suspended in a sunbeam.'))
          done()
        })
      })
    })

    describe('txt with map', function () {
      it('should match expected txt', function (done) {
        io.readData(testDataPath('txt/basic.txt'), {
          map: function (str) {
            return str.replace(/carbon/g, 'diamonds')
          }
        }, function (err, txt) {
          assert.equal(err, null)
          assert(_.isEqual(txt, 'The diamonds in our apple pies billions upon billions cosmos. Extraplanetary Hypatia. Tendrils of gossamer clouds? Rogue stirred by starlight across the centuries cosmic ocean white dwarf billions upon billions the diamonds in our apple pies Tunguska event, kindling the energy hidden in matter a still more glorious dawn awaits birth how far away quasar, vastness is bearable only through love of brilliant syntheses light years cosmic fugue, the diamonds in our apple pies, astonishment hearts of the stars from which we spring inconspicuous motes of rock and gas realm of the galaxies how far away decipherment radio telescope a mote of dust suspended in a sunbeam gathered by gravity a very small stage in a vast cosmic arena a mote of dust suspended in a sunbeam.'))
          done()
        })
      })
    })

    describe('txt with map shorthand', function () {
      it('should match expected txt', function (done) {
        io.readData(testDataPath('txt/basic.txt'), function (str) {
          return str.replace(/carbon/g, 'diamonds')
        }, function (err, txt) {
          assert.equal(err, null)
          assert(_.isEqual(txt, 'The diamonds in our apple pies billions upon billions cosmos. Extraplanetary Hypatia. Tendrils of gossamer clouds? Rogue stirred by starlight across the centuries cosmic ocean white dwarf billions upon billions the diamonds in our apple pies Tunguska event, kindling the energy hidden in matter a still more glorious dawn awaits birth how far away quasar, vastness is bearable only through love of brilliant syntheses light years cosmic fugue, the diamonds in our apple pies, astonishment hearts of the stars from which we spring inconspicuous motes of rock and gas realm of the galaxies how far away decipherment radio telescope a mote of dust suspended in a sunbeam gathered by gravity a very small stage in a vast cosmic arena a mote of dust suspended in a sunbeam.'))
          done()
        })
      })
    })

    describe('text', function () {
      it('should match expected text', function (done) {
        io.readData(testDataPath('text/basic.text'), function (err, txt) {
          assert.equal(err, null)
          assert(_.isEqual(txt, 'The carbon in our apple pies billions upon billions cosmos. Extraplanetary Hypatia. Tendrils of gossamer clouds? Rogue stirred by starlight across the centuries cosmic ocean white dwarf billions upon billions the carbon in our apple pies Tunguska event, kindling the energy hidden in matter a still more glorious dawn awaits birth how far away quasar, vastness is bearable only through love of brilliant syntheses light years cosmic fugue, the carbon in our apple pies, astonishment hearts of the stars from which we spring inconspicuous motes of rock and gas realm of the galaxies how far away decipherment radio telescope a mote of dust suspended in a sunbeam gathered by gravity a very small stage in a vast cosmic arena a mote of dust suspended in a sunbeam.'))
          done()
        })
      })
    })

    describe('text with map', function () {
      it('should match expected text', function (done) {
        io.readData(testDataPath('text/basic.text'), {
          map: function (str) {
            return str.replace(/carbon/g, 'diamonds')
          }
        }, function (err, text) {
          assert.equal(err, null)
          assert(_.isEqual(text, 'The diamonds in our apple pies billions upon billions cosmos. Extraplanetary Hypatia. Tendrils of gossamer clouds? Rogue stirred by starlight across the centuries cosmic ocean white dwarf billions upon billions the diamonds in our apple pies Tunguska event, kindling the energy hidden in matter a still more glorious dawn awaits birth how far away quasar, vastness is bearable only through love of brilliant syntheses light years cosmic fugue, the diamonds in our apple pies, astonishment hearts of the stars from which we spring inconspicuous motes of rock and gas realm of the galaxies how far away decipherment radio telescope a mote of dust suspended in a sunbeam gathered by gravity a very small stage in a vast cosmic arena a mote of dust suspended in a sunbeam.'))
          done()
        })
      })
    })

    describe('text with map shorthand', function () {
      it('should match expected text', function (done) {
        io.readData(testDataPath('text/basic.text'), function (str) {
          return str.replace(/carbon/g, 'diamonds')
        }, function (err, text) {
          assert.equal(err, null)
          assert(_.isEqual(text, 'The diamonds in our apple pies billions upon billions cosmos. Extraplanetary Hypatia. Tendrils of gossamer clouds? Rogue stirred by starlight across the centuries cosmic ocean white dwarf billions upon billions the diamonds in our apple pies Tunguska event, kindling the energy hidden in matter a still more glorious dawn awaits birth how far away quasar, vastness is bearable only through love of brilliant syntheses light years cosmic fugue, the diamonds in our apple pies, astonishment hearts of the stars from which we spring inconspicuous motes of rock and gas realm of the galaxies how far away decipherment radio telescope a mote of dust suspended in a sunbeam gathered by gravity a very small stage in a vast cosmic arena a mote of dust suspended in a sunbeam.'))
          done()
        })
      })
    })

    describe('yaml', function () {
      it('should match expected json', function (done) {
        io.readData(testDataPath('yaml/basic.yaml'), function (err, json) {
          assert.equal(err, null)
          assert(_.isEqual(JSON.stringify(json), '{"name":"jim","occupation":"land surveyor","height":70}'))
          done()
        })
      })
    })

    describe('yaml with map', function () {
      it('should match expected json', function (done) {
        io.readData(testDataPath('yaml/basic.yaml'), {
          map: function (yamlFile) {
            yamlFile.height = yamlFile.height * 2
            return yamlFile
          }
        }, function (err, json) {
          assert.equal(err, null)
          assert(_.isEqual(JSON.stringify(json), '{"name":"jim","occupation":"land surveyor","height":140}'))
          done()
        })
      })
    })

    describe('yaml with map shorthand', function () {
      it('should match expected json', function (done) {
        io.readData(testDataPath('yaml/basic.yaml'), function (yamlFile) {
          yamlFile.height = yamlFile.height * 2
          return yamlFile
        }, function (err, json) {
          assert.equal(err, null)
          assert(_.isEqual(JSON.stringify(json), '{"name":"jim","occupation":"land surveyor","height":140}'))
          done()
        })
      })
    })

    describe('yml', function () {
      it('should match expected json', function (done) {
        io.readData(testDataPath('yml/basic.yml'), function (err, json) {
          assert.equal(err, null)
          assert(_.isEqual(JSON.stringify(json), '{"name":"jim","occupation":"land surveyor","height":70}'))
          done()
        })
      })
    })

    describe('yml with map', function () {
      it('should match expected json', function (done) {
        io.readData(testDataPath('yml/basic.yml'), {
          map: function (yamlFile) {
            yamlFile.height = yamlFile.height * 2
            return yamlFile
          }
        }, function (err, json) {
          assert.equal(err, null)
          assert(_.isEqual(JSON.stringify(json), '{"name":"jim","occupation":"land surveyor","height":140}'))
          done()
        })
      })
    })

    describe('yml with map shorthand', function () {
      it('should match expected json', function (done) {
        io.readData(testDataPath('yml/basic.yml'), function (yamlFile) {
          yamlFile.height = yamlFile.height * 2
          return yamlFile
        }, function (err, json) {
          assert.equal(err, null)
          assert(_.isEqual(JSON.stringify(json), '{"name":"jim","occupation":"land surveyor","height":140}'))
          done()
        })
      })
    })

    describe('aml', function () {
      it('should match expected json', function (done) {
        io.readData(testDataPath('aml/basic.aml'), function (err, json) {
          assert.equal(err, null)
          assert(_.isEqual(JSON.stringify(json), '{"text":[{"type":"text","value":"I can type words here..."},{"type":"text","value":"And separate them into different paragraphs without tags."}]}'))
          done()
        })
      })
    })

    describe('aml with map', function () {
      it('should match expected json', function (done) {
        io.readData(testDataPath('aml/basic.aml'), {
          map: function (yamlFile) {
            yamlFile.text = 'hey'
            return yamlFile
          }
        }, function (err, json) {
          assert.equal(err, null)
          assert(_.isEqual(JSON.stringify(json), '{"text":"hey"}'))
          done()
        })
      })
    })

    describe('aml with map shorthand', function () {
      it('should match expected json', function (done) {
        io.readData(testDataPath('aml/basic.aml'), function (yamlFile) {
          yamlFile.text = 'hey'
          return yamlFile
        }, function (err, json) {
          assert.equal(err, null)
          assert(_.isEqual(JSON.stringify(json), '{"text":"hey"}'))
          done()
        })
      })
    })

    describe('dbf', function () {
      describe('empty', function () {
        it('should be empty array', function (done) {
          io.readData(testDataPath('dbf/empty.dbf'), function (err, json) {
            assert.equal(err.split('\n')[0], 'TypeError: Cannot read property \'buffer\' of null')
            done()
          })
        })
      })

      describe('basic', function () {
        it('should match expected json', function (done) {
          io.readDbf(testDataPath('dbf/basic.dbf'), function (err, json) {
            assert.equal(err, null)
            assert(_.isEqual(JSON.stringify(json), '[{"foo":"orange","bar":0},{"foo":"blue","bar":1},{"foo":"green","bar":2}]'))
            done()
          })
        })
      })

      describe('basic map', function () {
        it('should match expected json', function (done) {
          io.readData(testDataPath('dbf/basic.dbf'), {
            map: function (row, i) {
              row.bar = row.bar * 2
              return row
            }
          }, function (err, json) {
            assert.equal(err, null)
            assert(_.isEqual(JSON.stringify(json), '[{"foo":"orange","bar":0},{"foo":"blue","bar":2},{"foo":"green","bar":4}]'))
            done()
          })
        })
      })

      describe('basic map shorthand', function () {
        it('should match expected json', function (done) {
          io.readData(testDataPath('dbf/basic.dbf'), function (row, i) {
            row.bar = row.bar * 2
            return row
          }, function (err, json) {
            assert.equal(err, null)
            assert(_.isEqual(JSON.stringify(json), '[{"foo":"orange","bar":0},{"foo":"blue","bar":2},{"foo":"green","bar":4}]'))
            done()
          })
        })
      })
    })

    describe('custom delimiter string: `_`', function () {
      it('should match expected json', function (done) {
        io.readData(testDataPath('other/basic.usv'), {parser: '_'}, function (err, json) {
          assert.equal(err, null)
          assertBasicValid(json, true)
          done()
        })
      })
    })

    describe('custom delimiter fn with map', function () {
      it('should match expected json', function (done) {
        io.readData(testDataPath('other/basic.usv'), {
          parser: function (str, parserOptions) {
            return dsv.dsvFormat('_').parse(str, parserOptions.map)
          },
          map: function (row, i) {
            row.height = row.height * 2
            return row
          }
        }, function (err, json) {
          assert.equal(err, null)
          assert(_.isEqual(JSON.stringify(json), '[{"name":"jim","occupation":"land surveyor","height":140},{"name":"francis","occupation":"conductor","height":126}]'))
          done()
        })
      })
    })

    describe('custom delimiter parse fn: dsv.dsvFormat(\'_\').parse', function () {
      it('should match expected json', function (done) {
        io.readData(testDataPath('other/basic.usv'), {parser: dsv.dsvFormat('_').parse}, function (err, json) {
          assert.equal(err, null)
          assertBasicValid(json, true)
          done()
        })
      })
    })

    describe('custom delimiter object: dsv.dsvFormat(\'_\')', function () {
      it('should match expected json', function (done) {
        io.readData(testDataPath('other/basic.usv'), {parser: dsv.dsvFormat('_')}, function (err, json) {
          assert.equal(err, null)
          assertBasicValid(json, true)
          done()
        })
      })
    })

    describe('custom delimiter fn', function () {
      it('should match expected json', function (done) {
        io.readData(testDataPath('json/basic.json'), {parser: function (str) { return JSON.parse(str) }}, function (err, json) {
          assert.equal(err, null)
          assertBasicValid(json)
          done()
        })
      })
    })

    describe('unknown ext', function () {
      it('should match expected text', function (done) {
        io.readData(testDataPath('other/fancy-text-extension.text'), function (err, txt) {
          assert.equal(err, null)
          assert(_.isEqual(txt, 'The carbon in our apple pies billions upon billions cosmos. Extraplanetary Hypatia. Tendrils of gossamer clouds? Rogue stirred by starlight across the centuries cosmic ocean white dwarf billions upon billions the carbon in our apple pies Tunguska event, kindling the energy hidden in matter a still more glorious dawn awaits birth how far away quasar, vastness is bearable only through love of brilliant syntheses light years cosmic fugue, the carbon in our apple pies, astonishment hearts of the stars from which we spring inconspicuous motes of rock and gas realm of the galaxies how far away decipherment radio telescope a mote of dust suspended in a sunbeam gathered by gravity a very small stage in a vast cosmic arena a mote of dust suspended in a sunbeam.'))
          done()
        })
      })
    })
  })

  describe('readdirFilter()', function () {
    describe('empty', function () {
      it('should be empty', function (done) {
        io.readdirFilter(__dirname, {include: 'csv'}, function (err, files) {
          assert.equal(err, null)
          assert.lengthOf(files, 0)
          done()
        })
      })
    })

    describe('no options passed', function () {
      it('should match expected output', function (done) {
        var dir = path.join(__dirname, 'data', 'csv')
        io.readdirFilter(dir, function (err, files) {
          assert.equal(err, null)
          assert.lengthOf(files, 2)
          done()
        })
      })
    })

    describe('include by extension', function () {
      it('should match expected output', function (done) {
        var dir = path.join(__dirname, 'data', 'csv')
        io.readdirFilter(dir, {include: 'csv'}, function (err, files) {
          assert.equal(err, null)
          assert.lengthOf(files, 2)
          done()
        })
      })
    })

    describe('include by single list', function () {
      it('should match expected output', function (done) {
        var dir = path.join(__dirname, 'data', 'csv')
        io.readdirFilter(dir, {include: ['csv']}, function (err, files) {
          assert.equal(err, null)
          assert.lengthOf(files, 2)
          done()
        })
      })
    })

    describe('include by extension list', function () {
      it('should match expected output', function (done) {
        var dir = path.join(__dirname, 'data', 'mixed')
        io.readdirFilter(dir, {include: ['csv', 'tsv']}, function (err, files) {
          assert.equal(err, null)
          assert(_.isEqual(JSON.stringify(files), '["data-0.csv","data-0.tsv","data-1.csv"]'))
          done()
        })
      })
    })

    describe('include by extension list and regex', function () {
      it('should match expected output', function (done) {
        var dir = path.join(__dirname, 'data', 'mixed')
        io.readdirFilter(dir, {include: ['csv', 'tsv', /hidden/]}, function (err, files) {
          assert.equal(err, null)
          assert(_.isEqual(JSON.stringify(files), '[".hidden-file","data-0.csv","data-0.tsv","data-1.csv"]'))
          done()
        })
      })
    })

    describe('dirPath in filename', function () {
      it('should match expected output', function (done) {
        var dir = path.join(__dirname, 'data', 'csv')
        io.readdirFilter(dir, {include: 'csv', fullPath: true}, function (err, files) {
          assert.equal(err, null)
          done(assert.equal(files.indexOf(path.join(dir, 'basic.csv')), 0))
        })
      })
    })

    describe('all files match', function () {
      it('should be empty', function (done) {
        var dir = path.join(__dirname, 'data', 'csv')
        io.readdirFilter(dir, {exclude: 'csv'}, function (err, files) {
          assert.equal(err, null)
          assert.lengthOf(files, 0)
          done()
        })
      })
    })

    describe('exclude by extension', function () {
      it('should match expected out', function (done) {
        var dir = path.join(__dirname, 'data', 'mixed')
        io.readdirFilter(dir, {exclude: 'tsv'}, function (err, files) {
          assert.equal(err, null)
          assert(_.isEqual(JSON.stringify(files), '[".hidden-file","data-0.csv","data-0.json","data-1.csv","data-1.json"]'))
          done()
        })
      })
    })

    describe('exclude by extension list', function () {
      it('match expected output', function (done) {
        var dir = path.join(__dirname, 'data', 'mixed')
        io.readdirFilter(dir, {exclude: ['tsv', 'csv']}, function (err, files) {
          assert.equal(err, null)
          assert(_.isEqual(JSON.stringify(files), '[".hidden-file","data-0.json","data-1.json"]'))
          done()
        })
      })
    })

    describe('include and exclude by regex and extension list', function () {
      it('match expected output', function (done) {
        var dir = path.join(__dirname, 'data', 'mixed')
        io.readdirFilter(dir, {exclude: ['tsv', 'csv'], include: /^data/}, function (err, files) {
          assert.equal(err, null)
          assert(_.isEqual(JSON.stringify(files), '["data-0.json","data-1.json"]'))
          done()
        })
      })
    })

    describe('includeMatchAll', function () {
      it('match expected output', function (done) {
        var dir = path.join(__dirname, 'data', 'mixed')
        io.readdirFilter(dir, {include: [/^data-1/, 'json'], includeMatchAll: true}, function (err, files) {
          assert.equal(err, null)
          assert(_.isEqual(JSON.stringify(files), '["data-1.json"]'))
          done()
        })
      })
    })

    describe('excludeMatchAll', function () {
      it('match expected output', function (done) {
        var dir = path.join(__dirname, 'data', 'mixed')
        io.readdirFilter(dir, {exclude: [/^data-1/, 'json'], excludeMatchAll: true}, function (err, files) {
          assert.equal(err, null)
          assert(_.isEqual(JSON.stringify(files), '[".hidden-file","data-0.csv","data-0.json","data-0.tsv","data-1.csv"]'))
          done()
        })
      })
    })

    describe('exclude by extension list and regex', function () {
      it('match expected output', function (done) {
        var dir = path.join(__dirname, 'data', 'mixed')
        io.readdirFilter(dir, {exclude: ['tsv', 'csv', /^\./]}, function (err, files) {
          assert.equal(err, null)
          assert(_.isEqual(JSON.stringify(files), '["data-0.json","data-1.json"]'))
          done()
        })
      })
    })

    describe('dirPath in filename', function () {
      it('should match expected output', function (done) {
        var dir = path.join(__dirname, 'data', 'other')
        io.readdirFilter(dir, {exclude: 'csv', fullPath: true}, function (err, files) {
          assert.equal(err, null)
          done(assert.notEqual(files.indexOf(path.join(dir, 'this_is_not_a_csv.txt')), -1))
        })
      })
    })

    describe('get dirs only', function () {
      it('should match expected output', function (done) {
        var dir = path.join(__dirname, 'data', 'mixed-dirs')
        io.readdirFilter(dir, {skipFiles: true}, function (err, files) {
          assert.equal(err, null)
          assert(_.isEqual(JSON.stringify(files), '["sub-dir-0","sub-dir-1","sub-dir-2"]'))
          done()
        })
      })
    })

    describe('get files only', function () {
      it('should match expected output', function (done) {
        var dir = path.join(__dirname, 'data', 'mixed-dirs')
        io.readdirFilter(dir, {exclude: /^\./, skipDirectories: true}, function (err, files) {
          assert.equal(err, null)
          assert(_.isEqual(JSON.stringify(files), '["data-0.csv","data-0.json","data-0.tsv","data-1.csv","data-1.json"]'))
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
})

describe('shorthandReaders', function () {
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
      it('should match expected geojson', function () {
        var json = io.readJsonSync(testDataPath('geojson/basic.geojson'))
        assertBasicValid(json)
      })
    })

    describe('basic', function () {
      it('should match expected topojson', function () {
        var json = io.readJsonSync(testDataPath('topojson/basic.topojson'))
        assertBasicValid(json)
      })
    })

    describe('basic map', function () {
      it('should use map', function () {
        var json = io.readJsonSync(testDataPath('json/basic.json'), {
          map: function (row, i) {
            row.height = row.height * 2
            return row
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

    describe('basic map', function () {
      it('should match expected json', function () {
        var json = io.readCsvSync(testDataPath('csv/basic.csv'), {
          map: function (row, i, columns) {
            row.height = +row.height
            return row
          }
        })
        assertBasicValid(json)
      })
    })

    describe('basic map shorthand', function () {
      it('should match expected json', function () {
        var json = io.readCsvSync(testDataPath('csv/basic.csv'), function (row, i, columns) {
          row.height = +row.height
          return row
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

    describe('basic map', function () {
      it('should match expected json', function () {
        var json = io.readPsvSync(testDataPath('psv/basic.psv'), {
          map: function (row, i, columns) {
            row.height = +row.height
            return row
          }
        })
        assertBasicValid(json)
      })
    })

    describe('basic map shorthand', function () {
      it('should match expected json', function () {
        var json = io.readPsvSync(testDataPath('psv/basic.psv'), function (row, i, columns) {
          row.height = +row.height
          return row
        })
        assertBasicValid(json)
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

    describe('basic map', function () {
      it('should match expected json', function () {
        var json = io.readTsvSync(testDataPath('tsv/basic.tsv'), {
          map: function (row, i, columns) {
            row.height = +row.height
            return row
          }
        })
        assertBasicValid(json)
      })
    })

    describe('basic map shorthand', function () {
      it('should match expected json', function () {
        var json = io.readTsvSync(testDataPath('tsv/basic.tsv'), function (row, i, columns) {
          row.height = +row.height
          return row
        })
        assertBasicValid(json)
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
      it('should match expected txt', function () {
        var txt = io.readTxtSync(testDataPath('txt/basic.txt'))
        assert(_.isEqual(txt, 'The carbon in our apple pies billions upon billions cosmos. Extraplanetary Hypatia. Tendrils of gossamer clouds? Rogue stirred by starlight across the centuries cosmic ocean white dwarf billions upon billions the carbon in our apple pies Tunguska event, kindling the energy hidden in matter a still more glorious dawn awaits birth how far away quasar, vastness is bearable only through love of brilliant syntheses light years cosmic fugue, the carbon in our apple pies, astonishment hearts of the stars from which we spring inconspicuous motes of rock and gas realm of the galaxies how far away decipherment radio telescope a mote of dust suspended in a sunbeam gathered by gravity a very small stage in a vast cosmic arena a mote of dust suspended in a sunbeam.'))
      })
    })

    describe('basic replaced', function () {
      it('should match expected txt', function () {
        var txt = io.readTxtSync(testDataPath('txt/basic.txt'), {
          map: function (str) {
            return str.replace(/carbon/g, 'diamonds')
          }
        })
        assert(_.isEqual(txt, 'The diamonds in our apple pies billions upon billions cosmos. Extraplanetary Hypatia. Tendrils of gossamer clouds? Rogue stirred by starlight across the centuries cosmic ocean white dwarf billions upon billions the diamonds in our apple pies Tunguska event, kindling the energy hidden in matter a still more glorious dawn awaits birth how far away quasar, vastness is bearable only through love of brilliant syntheses light years cosmic fugue, the diamonds in our apple pies, astonishment hearts of the stars from which we spring inconspicuous motes of rock and gas realm of the galaxies how far away decipherment radio telescope a mote of dust suspended in a sunbeam gathered by gravity a very small stage in a vast cosmic arena a mote of dust suspended in a sunbeam.'))
      })
    })

    describe('basic replaced shorthand', function () {
      it('should match expected txt', function () {
        var txt = io.readTxtSync(testDataPath('txt/basic.txt'), function (str) {
          return str.replace(/carbon/g, 'diamonds')
        })
        assert(_.isEqual(txt, 'The diamonds in our apple pies billions upon billions cosmos. Extraplanetary Hypatia. Tendrils of gossamer clouds? Rogue stirred by starlight across the centuries cosmic ocean white dwarf billions upon billions the diamonds in our apple pies Tunguska event, kindling the energy hidden in matter a still more glorious dawn awaits birth how far away quasar, vastness is bearable only through love of brilliant syntheses light years cosmic fugue, the diamonds in our apple pies, astonishment hearts of the stars from which we spring inconspicuous motes of rock and gas realm of the galaxies how far away decipherment radio telescope a mote of dust suspended in a sunbeam gathered by gravity a very small stage in a vast cosmic arena a mote of dust suspended in a sunbeam.'))
      })
    })
  })

  describe('readYamlSync()', function () {
    describe('empty yaml', function () {
      it('should be empty object', function () {
        var json = io.readYamlSync(testDataPath('yaml/empty.yaml'))
        assert(_.isEmpty(json))
        assert(_.isObject(json))
      })
    })

    describe('basic yaml', function () {
      it('should match expected json', function () {
        var json = io.readYamlSync(testDataPath('yaml/basic.yaml'))
        assert(_.isEqual(JSON.stringify(json), '{"name":"jim","occupation":"land surveyor","height":70}'))
      })
    })

    describe('basic yaml map', function () {
      it('should match expected json', function () {
        var json = io.readYamlSync(testDataPath('yaml/basic.yaml'), {
          map: function (yamlFile) {
            yamlFile.height = yamlFile.height * 2
            return yamlFile
          }
        })
        assert(_.isEqual(JSON.stringify(json), '{"name":"jim","occupation":"land surveyor","height":140}'))
      })
    })

    describe('basic yaml map shorthand', function () {
      it('should match expected json', function () {
        var json = io.readYamlSync(testDataPath('yaml/basic.yaml'), function (yamlFile) {
          yamlFile.height = yamlFile.height * 2
          return yamlFile
        })
        assert(_.isEqual(JSON.stringify(json), '{"name":"jim","occupation":"land surveyor","height":140}'))
      })
    })

    describe('empty yml', function () {
      it('should be empty object', function () {
        var json = io.readYamlSync(testDataPath('yml/empty.yml'))
        assert(_.isEmpty(json))
        assert(_.isObject(json))
      })
    })

    describe('basic yml', function () {
      it('should match expected json', function () {
        var json = io.readYamlSync(testDataPath('yml/basic.yml'))
        assert(_.isEqual(JSON.stringify(json), '{"name":"jim","occupation":"land surveyor","height":70}'))
      })
    })

    describe('basic yml map', function () {
      it('should match expected json', function () {
        var json = io.readYamlSync(testDataPath('yml/basic.yml'), {
          map: function (yamlFile) {
            yamlFile.height = yamlFile.height * 2
            return yamlFile
          }
        })
        assert(_.isEqual(JSON.stringify(json), '{"name":"jim","occupation":"land surveyor","height":140}'))
      })
    })

    describe('basic yml map shorthand', function () {
      it('should match expected json', function () {
        var json = io.readYamlSync(testDataPath('yml/basic.yml'), function (yamlFile) {
          yamlFile.height = yamlFile.height * 2
          return yamlFile
        })
        assert(_.isEqual(JSON.stringify(json), '{"name":"jim","occupation":"land surveyor","height":140}'))
      })
    })
  })

  describe('readAmlSync()', function () {
    describe('empty', function () {
      it('should be empty object', function () {
        var json = io.readAmlSync(testDataPath('aml/empty.aml'))
        assert(_.isEmpty(json))
        assert(_.isObject(json))
      })
    })

    describe('basic', function () {
      it('should match expected json', function () {
        var json = io.readAmlSync(testDataPath('aml/basic.aml'))
        assert(_.isEqual(JSON.stringify(json), '{"text":[{"type":"text","value":"I can type words here..."},{"type":"text","value":"And separate them into different paragraphs without tags."}]}'))
      })
    })

    describe('basic map', function () {
      it('should match expected json', function () {
        var json = io.readAmlSync(testDataPath('aml/basic.aml'), {
          map: function (amlFile) {
            amlFile.text = 'hey'
            return amlFile
          }
        })
        assert(_.isEqual(JSON.stringify(json), '{"text":"hey"}'))
      })
    })

    describe('basic map shorthand', function () {
      it('should match expected json', function () {
        var json = io.readAmlSync(testDataPath('aml/basic.aml'), function (amlFile) {
          amlFile.text = 'hey'
          return amlFile
        })
        assert(_.isEqual(JSON.stringify(json), '{"text":"hey"}'))
      })
    })
  })

  describe('readJson()', function () {
    describe('empty', function () {
      it('should be empty', function (done) {
        io.readJson(testDataPath('json/empty.json'), function (err, json) {
          assert.equal(err, null)
          assert.lengthOf(json, 0)
          done()
        })
      })
    })

    describe('basic', function () {
      it('should match expected json', function (done) {
        io.readJson(testDataPath('json/basic.json'), function (err, json) {
          assert.equal(err, null)
          assertBasicValid(json)
          done()
        })
      })
    })

    describe('basic map', function () {
      it('should match expected json', function (done) {
        io.readJson(testDataPath('json/basic.json'), {
          map: function (row, i) {
            row.height = row.height * 2
            return row
          }
        }, function (err, json) {
          assert.equal(err, null)
          assert(_.isEqual(JSON.stringify(json), '[{"name":"jim","occupation":"land surveyor","height":140},{"name":"francis","occupation":"conductor","height":126}]'))
          done()
        })
      })
    })

    describe('basic map shorthand', function () {
      it('should match expected json', function (done) {
        io.readJson(testDataPath('json/basic.json'), function (row, i) {
          row.height = row.height * 2
          return row
        }, function (err, json) {
          assert.equal(err, null)
          assert(_.isEqual(JSON.stringify(json), '[{"name":"jim","occupation":"land surveyor","height":140},{"name":"francis","occupation":"conductor","height":126}]'))
          done()
        })
      })
    })

    describe('invalid', function () {
      it('should raise an error', function (done) {
        io.readJson(testDataPath('json/invalid.json'), function (err, json) {
          assert.equal(err.message.indexOf('Unexpected token w') > -1, true)
          done()
        })
      })
    })
  })

  describe('readCsv()', function () {
    describe('empty', function () {
      it('should be empty', function (done) {
        io.readCsv(testDataPath('csv/empty.csv'), function (err, json) {
          assert.equal(err, null)
          assert.lengthOf(json, 0)
          done()
        })
      })
    })

    describe('basic', function () {
      it('should match expected json', function (done) {
        io.readCsv(testDataPath('csv/basic.csv'), function (err, json) {
          assert.equal(err, null)
          assertBasicValid(json, true)
          done()
        })
      })
    })

    describe('basic map', function () {
      it('should match expected json', function (done) {
        io.readCsv(testDataPath('csv/basic.csv'), {
          map: function (row, i, columns) {
            row.height = +row.height
            return row
          }
        }, function (err, json) {
          assert.equal(err, null)
          assertBasicValid(json)
          done()
        })
      })
    })

    describe('basic map shorthand', function () {
      it('should match expected json', function (done) {
        io.readCsv(testDataPath('csv/basic.csv'), function (row, i, columns) {
          row.height = +row.height
          return row
        }, function (err, json) {
          assert.equal(err, null)
          assertBasicValid(json)
          done()
        })
      })
    })
  })

  describe('readPsv()', function () {
    describe('empty', function () {
      it('should be empty', function (done) {
        io.readPsv(testDataPath('psv/empty.psv'), function (err, json) {
          assert.equal(err, null)
          assert.lengthOf(json, 0)
          done()
        })
      })
    })

    describe('basic', function () {
      it('should match expected json', function (done) {
        io.readPsv(testDataPath('psv/basic.psv'), function (err, json) {
          assert.equal(err, null)
          assertBasicValid(json, true)
          done()
        })
      })
    })

    describe('basic map', function () {
      it('should match expected json', function (done) {
        io.readPsv(testDataPath('psv/basic.psv'), {
          map: function (row, i, columns) {
            row.height = +row.height
            return row
          }
        }, function (err, json) {
          assert.equal(err, null)
          assertBasicValid(json)
          done()
        })
      })
    })

    describe('basic map shorthand', function () {
      it('should match expected json', function (done) {
        io.readPsv(testDataPath('psv/basic.psv'), function (row, i, columns) {
          row.height = +row.height
          return row
        }, function (err, json) {
          assert.equal(err, null)
          assertBasicValid(json)
          done()
        })
      })
    })
  })

  describe('readTsv()', function () {
    describe('empty', function () {
      it('should be empty', function (done) {
        io.readTsv(testDataPath('tsv/empty.tsv'), function (err, json) {
          assert.equal(err, null)
          assert.lengthOf(json, 0)
          done()
        })
      })
    })

    describe('basic', function () {
      it('should match expected json', function (done) {
        io.readTsv(testDataPath('tsv/basic.tsv'), function (err, json) {
          assert.equal(err, null)
          assertBasicValid(json, true)
          done()
        })
      })
    })

    describe('basic map', function () {
      it('should match expected json', function (done) {
        io.readTsv(testDataPath('tsv/basic.tsv'), {
          map: function (row, i, columns) {
            row.height = +row.height
            return row
          }
        }, function (err, json) {
          assert.equal(err, null)
          assertBasicValid(json)
          done()
        })
      })
    })

    describe('basic map shorthand', function () {
      it('should match expected json', function (done) {
        io.readTsv(testDataPath('tsv/basic.tsv'), function (row, i, columns) {
          row.height = +row.height
          return row
        }, function (err, json) {
          assert.equal(err, null)
          assertBasicValid(json)
          done()
        })
      })
    })
  })

  describe('readTxt()', function () {
    describe('empty', function () {
      it('should be empty', function (done) {
        io.readTxt(testDataPath('txt/empty.txt'), function (err, json) {
          assert.equal(err, null)
          assert.lengthOf(json, 0)
          done()
        })
      })
    })

    describe('basic', function () {
      it('should match expected txt', function (done) {
        io.readTxt(testDataPath('txt/basic.txt'), function (err, txt) {
          assert.equal(err, null)
          assert(_.isEqual(txt, 'The carbon in our apple pies billions upon billions cosmos. Extraplanetary Hypatia. Tendrils of gossamer clouds? Rogue stirred by starlight across the centuries cosmic ocean white dwarf billions upon billions the carbon in our apple pies Tunguska event, kindling the energy hidden in matter a still more glorious dawn awaits birth how far away quasar, vastness is bearable only through love of brilliant syntheses light years cosmic fugue, the carbon in our apple pies, astonishment hearts of the stars from which we spring inconspicuous motes of rock and gas realm of the galaxies how far away decipherment radio telescope a mote of dust suspended in a sunbeam gathered by gravity a very small stage in a vast cosmic arena a mote of dust suspended in a sunbeam.'))
          done()
        })
      })
    })

    describe('basic replaced', function () {
      it('should match expected txt', function (done) {
        io.readTxt(testDataPath('txt/basic.txt'), {
          map: function (str) {
            return str.replace(/carbon/g, 'diamonds')
          }
        },
        function (err, txt) {
          assert.equal(err, null)
          assert(_.isEqual(txt, 'The diamonds in our apple pies billions upon billions cosmos. Extraplanetary Hypatia. Tendrils of gossamer clouds? Rogue stirred by starlight across the centuries cosmic ocean white dwarf billions upon billions the diamonds in our apple pies Tunguska event, kindling the energy hidden in matter a still more glorious dawn awaits birth how far away quasar, vastness is bearable only through love of brilliant syntheses light years cosmic fugue, the diamonds in our apple pies, astonishment hearts of the stars from which we spring inconspicuous motes of rock and gas realm of the galaxies how far away decipherment radio telescope a mote of dust suspended in a sunbeam gathered by gravity a very small stage in a vast cosmic arena a mote of dust suspended in a sunbeam.'))
          done()
        })
      })
    })

    describe('basic replaced shorthand', function () {
      it('should match expected txt', function (done) {
        io.readTxt(testDataPath('txt/basic.txt'), function (str) {
          return str.replace(/carbon/g, 'diamonds')
        },
        function (err, txt) {
          assert.equal(err, null)
          assert(_.isEqual(txt, 'The diamonds in our apple pies billions upon billions cosmos. Extraplanetary Hypatia. Tendrils of gossamer clouds? Rogue stirred by starlight across the centuries cosmic ocean white dwarf billions upon billions the diamonds in our apple pies Tunguska event, kindling the energy hidden in matter a still more glorious dawn awaits birth how far away quasar, vastness is bearable only through love of brilliant syntheses light years cosmic fugue, the diamonds in our apple pies, astonishment hearts of the stars from which we spring inconspicuous motes of rock and gas realm of the galaxies how far away decipherment radio telescope a mote of dust suspended in a sunbeam gathered by gravity a very small stage in a vast cosmic arena a mote of dust suspended in a sunbeam.'))
          done()
        })
      })
    })
  })

  describe('readYaml()', function () {
    describe('empty yaml', function () {
      it('should be empty object', function (done) {
        io.readYaml(testDataPath('yaml/empty.yaml'), function (err, json) {
          assert.equal(err, null)
          assert(_.isEmpty(json))
          assert(_.isObject(json))
          done()
        })
      })
    })

    describe('basic yaml', function () {
      it('should match expected json', function (done) {
        io.readYaml(testDataPath('yaml/basic.yaml'), function (err, json) {
          assert.equal(err, null)
          assert(_.isEqual(JSON.stringify(json), '{"name":"jim","occupation":"land surveyor","height":70}'))
          done()
        })
      })
    })

    describe('empty yml', function () {
      it('should be empty object', function (done) {
        io.readYaml(testDataPath('yml/empty.yml'), function (err, json) {
          assert.equal(err, null)
          assert(_.isEmpty(json))
          assert(_.isObject(json))
          done()
        })
      })
    })

    describe('basic yml', function () {
      it('should be empty', function (done) {
        io.readYaml(testDataPath('yml/basic.yml'), function (err, json) {
          assert.equal(err, null)
          assert(_.isEqual(JSON.stringify(json), '{"name":"jim","occupation":"land surveyor","height":70}'))
          done()
        })
      })
    })

    describe('basic yaml map', function () {
      it('should match expected json', function (done) {
        io.readYaml(testDataPath('yaml/basic.yaml'), {
          map: function (yamlFile) {
            yamlFile.height = yamlFile.height * 2
            return yamlFile
          }
        }, function (err, json) {
          assert.equal(err, null)
          assert(_.isEqual(JSON.stringify(json), '{"name":"jim","occupation":"land surveyor","height":140}'))
          done()
        })
      })
    })

    describe('basic yaml map shorthand', function () {
      it('should match expected json', function (done) {
        io.readYaml(testDataPath('yaml/basic.yaml'), function (yamlFile) {
          yamlFile.height = yamlFile.height * 2
          return yamlFile
        }, function (err, json) {
          assert.equal(err, null)
          assert(_.isEqual(JSON.stringify(json), '{"name":"jim","occupation":"land surveyor","height":140}'))
          done()
        })
      })
    })

    describe('empty yml', function () {
      it('should be empty object', function (done) {
        io.readYaml(testDataPath('yml/empty.yml'), function (err, json) {
          assert.equal(err, null)
          assert(_.isEmpty(json))
          assert(_.isObject(json))
          done()
        })
      })
    })

    describe('basic yml', function () {
      it('should match expected json', function (done) {
        io.readYaml(testDataPath('yml/basic.yml'), function (err, json) {
          assert.equal(err, null)
          assert(_.isEqual(JSON.stringify(json), '{"name":"jim","occupation":"land surveyor","height":70}'))
          done()
        })
      })
    })

    describe('basic yml map', function () {
      it('should match expected json', function (done) {
        io.readYaml(testDataPath('yml/basic.yml'), {
          map: function (yamlFile) {
            yamlFile.height = yamlFile.height * 2
            return yamlFile
          }
        }, function (err, json) {
          assert.equal(err, null)
          assert(_.isEqual(JSON.stringify(json), '{"name":"jim","occupation":"land surveyor","height":140}'))
          done()
        })
      })
    })

    describe('basic yml map', function () {
      it('should match expected json', function (done) {
        io.readYaml(testDataPath('yml/basic.yml'), {
          map: function (yamlFile) {
            yamlFile.height = yamlFile.height * 2
            return yamlFile
          }
        }, function (err, json) {
          assert.equal(err, null)
          assert(_.isEqual(JSON.stringify(json), '{"name":"jim","occupation":"land surveyor","height":140}'))
          done()
        })
      })
    })

    describe('basic yml map shorthand', function () {
      it('should match expected json', function (done) {
        io.readYaml(testDataPath('yml/basic.yml'), function (yamlFile) {
          yamlFile.height = yamlFile.height * 2
          return yamlFile
        }, function (err, json) {
          assert.equal(err, null)
          assert(_.isEqual(JSON.stringify(json), '{"name":"jim","occupation":"land surveyor","height":140}'))
          done()
        })
      })
    })
  })

  describe('readAml()', function () {
    describe('empty', function () {
      it('should be empty object', function (done) {
        io.readAml(testDataPath('aml/empty.aml'), function (err, json) {
          assert.equal(err, null)
          assert(_.isEmpty(json))
          assert(_.isObject(json))
          done()
        })
      })
    })

    describe('basic', function () {
      it('should match expected json', function (done) {
        io.readAml(testDataPath('aml/basic.aml'), function (err, json) {
          assert.equal(err, null)
          assert(_.isEqual(JSON.stringify(json), '{"text":[{"type":"text","value":"I can type words here..."},{"type":"text","value":"And separate them into different paragraphs without tags."}]}'))
          done()
        })
      })
    })

    describe('basic map', function () {
      it('should match expected json', function (done) {
        io.readAml(testDataPath('aml/basic.aml'), {
          map: function (amlFile) {
            amlFile.text = 'hey'
            return amlFile
          }
        }, function (err, json) {
          assert.equal(err, null)
          assert(_.isEqual(JSON.stringify(json), '{"text":"hey"}'))
          done()
        })
      })
    })

    describe('basic map shorthand', function () {
      it('should match expected json', function (done) {
        io.readAml(testDataPath('aml/basic.aml'), function (amlFile) {
          amlFile.text = 'hey'
          return amlFile
        }, function (err, json) {
          assert.equal(err, null)
          assert(_.isEqual(JSON.stringify(json), '{"text":"hey"}'))
          done()
        })
      })
    })
  })
})

describe('readDbf()', function () {
  describe('empty', function () {
    it('should be empty array', function (done) {
      io.readDbf(testDataPath('dbf/empty.dbf'), function (err, json) {
        assert.equal(err.split('\n')[0], 'TypeError: Cannot read property \'buffer\' of null')
        done()
      })
    })
  })

  describe('basic', function () {
    it('should match expected json', function (done) {
      io.readDbf(testDataPath('dbf/basic.dbf'), function (err, json) {
        assert.equal(err, null)
        assert(_.isEqual(JSON.stringify(json), '[{"foo":"orange","bar":0},{"foo":"blue","bar":1},{"foo":"green","bar":2}]'))
        done()
      })
    })
  })

  describe('basic map', function () {
    it('should match expected json', function (done) {
      io.readDbf(testDataPath('dbf/basic.dbf'), {
        map: function (row, i) {
          row.bar = row.bar * 2
          return row
        }
      }, function (err, json) {
        assert.equal(err, null)
        assert(_.isEqual(JSON.stringify(json), '[{"foo":"orange","bar":0},{"foo":"blue","bar":2},{"foo":"green","bar":4}]'))
        done()
      })
    })
  })

  describe('basic map shorthand', function () {
    it('should match expected json', function (done) {
      io.readDbf(testDataPath('dbf/basic.dbf'), function (row, i) {
        row.bar = row.bar * 2
        return row
      }, function (err, json) {
        assert.equal(err, null)
        assert(_.isEqual(JSON.stringify(json), '[{"foo":"orange","bar":0},{"foo":"blue","bar":2},{"foo":"green","bar":4}]'))
        done()
      })
    })
  })
})

describe('writers', function () {
  describe('writeData()', function () {
    describe('json', function () {
      it('should write as json', function (done) {
        var filePath = ['test', 'tmp-write-data-json', 'data.json']
        io.writeData(filePath.join(path.sep), testData, {makeDirectories: true}, function (err) {
          assert.equal(err, null)
          readAssertBasicValid(filePath.join(path.sep))
          rimraf(filePath.slice(0, 2).join(path.sep), {glob: false}, function (err) {
            assert.equal(err, null)
            done()
          })
        })
      })

      it('should write with json replacer fn', function (done) {
        var filePath = ['test', 'tmp-write-data-json-replacer-fn', 'data.json']
        io.writeData(filePath.join(path.sep), testData, {
          makeDirectories: true,
          replacer: function (key, value) {
            // Filtering out string properties
            if (typeof value === 'string') {
              return undefined
            }
            return value
          }
        }, function (err, dataString) {
          assert.equal(err, null)
          assert.equal(dataString, '[{"height":70},{"height":63}]')
          assert.equal(fs.readFileSync(filePath.join(path.sep), 'utf-8'), dataString)
          rimraf(filePath.slice(0, 2).join(path.sep), {glob: false}, function (err) {
            assert.equal(err, null)
            done()
          })
        })
      })

      it('should write with json replacer array', function (done) {
        var filePath = ['test', 'tmp-write-data-json-replacer-array', 'data.json']
        io.writeData(filePath.join(path.sep), testData, {
          makeDirectories: true,
          replacer: ['height']
        }, function (err, dataString) {
          assert.equal(err, null)
          assert.equal(dataString, '[{"height":70},{"height":63}]')
          assert.equal(fs.readFileSync(filePath.join(path.sep), 'utf-8'), dataString)
          rimraf(filePath.slice(0, 2).join(path.sep), {glob: false}, function (err) {
            assert.equal(err, null)
            done()
          })
        })
      })

      it('should write with json indent', function (done) {
        var filePath = ['test', 'tmp-write-data-json-indent', 'data.json']
        io.writeData(filePath.join(path.sep), testData, {
          makeDirectories: true,
          indent: 2
        }, function (err, dataString) {
          assert.equal(err, null)
          assert.equal(dataString, '[\n  {\n    "name": "jim",\n    "occupation": "land surveyor",\n    "height": 70\n  },\n  {\n    "name": "francis",\n    "occupation": "conductor",\n    "height": 63\n  }\n]')
          assert.equal(fs.readFileSync(filePath.join(path.sep), 'utf-8'), dataString)
          rimraf(filePath.slice(0, 2).join(path.sep), {glob: false}, function (err) {
            assert.equal(err, null)
            done()
          })
        })
      })

      it('should write as json without making directory', function (done) {
        var filePath = ['test', 'test-out-data.json']
        io.writeData(filePath.join(path.sep), testData, function (err) {
          assert.equal(err, null)
          readAssertBasicValid(filePath.join(path.sep))
          rimraf(filePath.join(path.sep), {glob: false}, function (err) {
            assert.equal(err, null)
            done()
          })
        })
      })
    })

    describe('geojson', function () {
      it('should write as geojson', function (done) {
        var filePath = ['test', 'tmp-write-data-geojson', 'data.geojson']
        io.writeData(filePath.join(path.sep), testData, {makeDirectories: true}, function (err) {
          assert.equal(err, null)
          readAssertBasicValid(filePath.join(path.sep))
          rimraf(filePath.slice(0, 2).join(path.sep), {glob: false}, function (err) {
            assert.equal(err, null)
            done()
          })
        })
      })
    })

    describe('topojson', function () {
      it('should write as topojson', function (done) {
        var filePath = ['test', 'tmp-write-data-topojson', 'data.topojson']
        io.writeData(filePath.join(path.sep), testData, {makeDirectories: true}, function (err) {
          assert.equal(err, null)
          readAssertBasicValid(filePath.join(path.sep))
          rimraf(filePath.slice(0, 2).join(path.sep), {glob: false}, function (err) {
            assert.equal(err, null)
            done()
          })
        })
      })
    })

    describe('geojson', function () {
      it('should write as geojson with indent', function (done) {
        var filePath = ['test', 'tmp-write-data-geojson-indent', 'data.geojson']
        io.writeData(filePath.join(path.sep), testData, {
          makeDirectories: true,
          indent: 2
        }, function (err, dataString) {
          assert.equal(err, null)
          assert.equal(dataString, '[\n  {\n    "name": "jim",\n    "occupation": "land surveyor",\n    "height": 70\n  },\n  {\n    "name": "francis",\n    "occupation": "conductor",\n    "height": 63\n  }\n]')
          assert.equal(fs.readFileSync(filePath.join(path.sep), 'utf-8'), dataString)
          rimraf(filePath.slice(0, 2).join(path.sep), {glob: false}, function (err) {
            assert.equal(err, null)
            done()
          })
        })
      })
    })

    describe('topojson', function () {
      it('should write as topojson with indent', function (done) {
        var filePath = ['test', 'tmp-write-data-topojson-indent', 'data.topojson']
        io.writeData(filePath.join(path.sep), testData, {
          makeDirectories: true,
          indent: 2
        }, function (err, dataString) {
          assert.equal(err, null)
          assert.equal(dataString, '[\n  {\n    "name": "jim",\n    "occupation": "land surveyor",\n    "height": 70\n  },\n  {\n    "name": "francis",\n    "occupation": "conductor",\n    "height": 63\n  }\n]')
          assert.equal(fs.readFileSync(filePath.join(path.sep), 'utf-8'), dataString)
          rimraf(filePath.slice(0, 2).join(path.sep), {glob: false}, function (err) {
            assert.equal(err, null)
            done()
          })
        })
      })
    })

    describe('csv', function () {
      it('should write as csv', function (done) {
        var filePath = ['test', 'tmp-write-data-csv', 'data.csv']
        io.writeData(filePath.join(path.sep), testData, {makeDirectories: true}, function (err) {
          assert.equal(err, null)
          readAssertBasicValid(filePath.join(path.sep))
          rimraf(filePath.slice(0, 2).join(path.sep), {glob: false}, function (err) {
            assert.equal(err, null)
            done()
          })
        })
      })
    })

    describe('tsv', function () {
      it('should write as tsv', function (done) {
        var filePath = ['test', 'tmp-write-data-tsv', 'data.tsv']
        io.writeData(filePath.join(path.sep), testData, {makeDirectories: true}, function (err) {
          assert.equal(err, null)
          readAssertBasicValid(filePath.join(path.sep))
          rimraf(filePath.slice(0, 2).join(path.sep), {glob: false}, function (err) {
            assert.equal(err, null)
            done()
          })
        })
      })
    })

    describe('psv', function () {
      it('should write as psv', function (done) {
        var filePath = ['test', 'tmp-write-data-psv', 'data.psv']
        io.writeData(filePath.join(path.sep), testData, {makeDirectories: true}, function (err) {
          assert.equal(err, null)
          readAssertBasicValid(filePath.join(path.sep))
          rimraf(filePath.slice(0, 2).join(path.sep), {glob: false}, function (err) {
            assert.equal(err, null)
            done()
          })
        })
      })
    })

    describe('yaml', function () {
      it('should write as yaml', function (done) {
        var filePath = ['test', 'tmp-write-data-yaml', 'data.yaml']
        io.writeData(filePath.join(path.sep), testData[0], {makeDirectories: true}, function (err) {
          assert.equal(err, null)
          readAssertBasicValidObject(filePath.join(path.sep))
          rimraf(filePath.slice(0, 2).join(path.sep), {glob: false}, function (err) {
            assert.equal(err, null)
            done()
          })
        })
      })

      it('should write as yaml with indent', function (done) {
        var filePath = ['test', 'tmp-write-data-yaml-indent', 'data.yaml']
        io.writeData(filePath.join(path.sep), testData, {makeDirectories: true, indent: 4}, function (err, dataString) {
          var testString = '-\n    name: jim\n    occupation: land surveyor\n    height: 70\n-\n    name: francis\n    occupation: conductor\n    height: 63\n'
          assert.equal(err, null)
          assert.equal(fs.readFileSync(filePath.join(path.sep), 'utf-8'), testString)
          assert.equal(dataString, testString)
          rimraf(filePath.slice(0, 2).join(path.sep), {glob: false}, function (err) {
            assert.equal(err, null)
            done()
          })
        })
      })
    })

    describe('yml', function () {
      it('should write as yml', function (done) {
        var filePath = ['test', 'tmp-write-data-yml', 'data.yml']
        io.writeData(filePath.join(path.sep), testData[0], {makeDirectories: true}, function (err) {
          assert.equal(err, null)
          readAssertBasicValidObject(filePath.join(path.sep))
          rimraf(filePath.slice(0, 2).join(path.sep), {glob: false}, function (err) {
            assert.equal(err, null)
            done()
          })
        })
      })

      it('should write as yml with indent', function (done) {
        var filePath = ['test', 'tmp-write-data-yml-indent', 'data.yml']
        io.writeData(filePath.join(path.sep), testData, {makeDirectories: true, indent: 4}, function (err, dataString) {
          var testString = '-\n    name: jim\n    occupation: land surveyor\n    height: 70\n-\n    name: francis\n    occupation: conductor\n    height: 63\n'
          assert.equal(err, null)
          assert.equal(fs.readFileSync(filePath.join(path.sep), 'utf-8'), testString)
          assert.equal(dataString, testString)
          rimraf(filePath.slice(0, 2).join(path.sep), {glob: false}, function (err) {
            assert.equal(err, null)
            done()
          })
        })
      })
    })
  })

  describe('writeDataSync()', function () {
    describe('json', function () {
      it('should write as json', function (done) {
        var filePath = ['test', 'tmp-write-data-json-sync', 'data.json']
        io.writeDataSync(filePath.join(path.sep), testData, {makeDirectories: true})
        readAssertBasicValid(filePath.join(path.sep))
        rimraf(filePath.slice(0, 2).join(path.sep), {glob: false}, function (err) {
          assert.equal(err, null)
          done()
        })
      })

      it('should write two json files with shared opts creating different directories', function (done) {
        var filePath = ['test', 'tmp-write-data-json-sync', 'data.json']
        var filePath2 = ['test', 'tmp-write-data-json-sync2', 'data.json']
        var opts = {makeDirectories: true}
        io.writeDataSync(filePath.join(path.sep), testData, opts)
        io.writeDataSync(filePath2.join(path.sep), testData, opts)
        readAssertBasicValid(filePath.join(path.sep))
        rimraf(filePath.slice(0, 2).join(path.sep), {glob: false}, function (err) {
          assert.equal(err, null)
          done()
        })
      })

      it('should write with json replacer fn', function (done) {
        var filePath = ['test', 'tmp-write-data-json-replacer-fn-sync', 'data.json']
        var dataString = io.writeDataSync(filePath.join(path.sep), testData, {
          makeDirectories: true,
          replacer: function (key, value) {
            // Filtering out string properties
            if (typeof value === 'string') {
              return undefined
            }
            return value
          }
        })
        assert.equal(dataString, '[{"height":70},{"height":63}]')
        assert.equal(fs.readFileSync(filePath.join(path.sep), 'utf-8'), dataString)
        rimraf(filePath.slice(0, 2).join(path.sep), {glob: false}, function (err) {
          assert.equal(err, null)
          done()
        })
      })

      it('should write with json replacer array', function (done) {
        var filePath = ['test', 'tmp-write-data-json-replacer-array-sync', 'data.json']
        var dataString = io.writeDataSync(filePath.join(path.sep), testData, {
          makeDirectories: true,
          replacer: ['height']
        })
        assert.equal(dataString, '[{"height":70},{"height":63}]')
        assert.equal(fs.readFileSync(filePath.join(path.sep), 'utf-8'), dataString)
        rimraf(filePath.slice(0, 2).join(path.sep), {glob: false}, function (err) {
          assert.equal(err, null)
          done()
        })
      })

      it('should write with json indent', function (done) {
        var filePath = ['test', 'tmp-write-data-json-indent-sync', 'data.json']
        var dataString = io.writeDataSync(filePath.join(path.sep), testData, {
          makeDirectories: true,
          indent: 2
        })
        assert.equal(dataString, '[\n  {\n    "name": "jim",\n    "occupation": "land surveyor",\n    "height": 70\n  },\n  {\n    "name": "francis",\n    "occupation": "conductor",\n    "height": 63\n  }\n]')
        assert.equal(fs.readFileSync(filePath.join(path.sep), 'utf-8'), dataString)
        rimraf(filePath.slice(0, 2).join(path.sep), {glob: false}, function (err) {
          assert.equal(err, null)
          done()
        })
      })

      it('should write as json without making directory', function (done) {
        var filePath = ['test', 'test-out-data-sync.json']
        io.writeDataSync(filePath.join(path.sep), testData)
        readAssertBasicValid(filePath.join(path.sep))
        rimraf(filePath.join(path.sep), {glob: false}, function (err) {
          assert.equal(err, null)
          done()
        })
      })
    })

    describe('geojson', function () {
      it('should write as geojson', function (done) {
        var filePath = ['test', 'tmp-write-data-geojson-sync', 'data.geojson']
        io.writeDataSync(filePath.join(path.sep), testData, {makeDirectories: true})
        readAssertBasicValid(filePath.join(path.sep))
        rimraf(filePath.slice(0, 2).join(path.sep), {glob: false}, function (err) {
          assert.equal(err, null)
          done()
        })
      })
    })

    describe('topojson', function () {
      it('should write as topojson', function (done) {
        var filePath = ['test', 'tmp-write-data-topojson-sync', 'data.topojson']
        io.writeDataSync(filePath.join(path.sep), testData, {makeDirectories: true})
        readAssertBasicValid(filePath.join(path.sep))
        rimraf(filePath.slice(0, 2).join(path.sep), {glob: false}, function (err) {
          assert.equal(err, null)
          done()
        })
      })
    })

    describe('geojson', function () {
      it('should write as geojson with indent', function (done) {
        var filePath = ['test', 'tmp-write-data-geojson-indent-sync', 'data.geojson']
        var dataString = io.writeDataSync(filePath.join(path.sep), testData, {
          makeDirectories: true,
          indent: 2
        })
        assert.equal(dataString, '[\n  {\n    "name": "jim",\n    "occupation": "land surveyor",\n    "height": 70\n  },\n  {\n    "name": "francis",\n    "occupation": "conductor",\n    "height": 63\n  }\n]')
        assert.equal(fs.readFileSync(filePath.join(path.sep), 'utf-8'), dataString)
        rimraf(filePath.slice(0, 2).join(path.sep), {glob: false}, function (err) {
          assert.equal(err, null)
          done()
        })
      })
    })

    describe('topojson', function () {
      it('should write as topojson with indent', function (done) {
        var filePath = ['test', 'tmp-write-data-topojson-indent-sync', 'data.topojson']
        var dataString = io.writeDataSync(filePath.join(path.sep), testData, {
          makeDirectories: true,
          indent: 2
        })
        assert.equal(dataString, '[\n  {\n    "name": "jim",\n    "occupation": "land surveyor",\n    "height": 70\n  },\n  {\n    "name": "francis",\n    "occupation": "conductor",\n    "height": 63\n  }\n]')
        assert.equal(fs.readFileSync(filePath.join(path.sep), 'utf-8'), dataString)
        rimraf(filePath.slice(0, 2).join(path.sep), {glob: false}, function (err) {
          assert.equal(err, null)
          done()
        })
      })
    })

    describe('csv', function () {
      it('should write as csv', function (done) {
        var filePath = ['test', 'tmp-write-data-csv-sync', 'data.csv']
        io.writeDataSync(filePath.join(path.sep), testData, {makeDirectories: true})
        readAssertBasicValid(filePath.join(path.sep))
        rimraf(filePath.slice(0, 2).join(path.sep), {glob: false}, function (err) {
          assert.equal(err, null)
          done()
        })
      })
    })

    describe('tsv', function () {
      it('should write as tsv', function (done) {
        var filePath = ['test', 'tmp-write-data-tsv-sync', 'data.tsv']
        io.writeDataSync(filePath.join(path.sep), testData, {makeDirectories: true})
        readAssertBasicValid(filePath.join(path.sep))
        rimraf(filePath.slice(0, 2).join(path.sep), {glob: false}, function (err) {
          assert.equal(err, null)
          done()
        })
      })
    })

    describe('psv', function () {
      it('should write as psv', function (done) {
        var filePath = ['test', 'tmp-write-data-psv-sync', 'data.psv']
        io.writeDataSync(filePath.join(path.sep), testData, {makeDirectories: true})
        readAssertBasicValid(filePath.join(path.sep))
        rimraf(filePath.slice(0, 2).join(path.sep), {glob: false}, function (err) {
          assert.equal(err, null)
          done()
        })
      })
    })

    describe('yaml', function () {
      it('should write as yaml', function (done) {
        var filePath = ['test', 'tmp-write-data-yaml-sync', 'data.yaml']
        io.writeDataSync(filePath.join(path.sep), testData[0], {makeDirectories: true})
        readAssertBasicValidObject(filePath.join(path.sep))
        rimraf(filePath.slice(0, 2).join(path.sep), {glob: false}, function (err) {
          assert.equal(err, null)
          done()
        })
      })

      it('should write as yaml with indent', function (done) {
        var filePath = ['test', 'tmp-write-data-yaml-indent-sync', 'data.yaml']
        var dataString = io.writeDataSync(filePath.join(path.sep), testData, {
          makeDirectories: true,
          indent: 4
        })
        var testString = '-\n    name: jim\n    occupation: land surveyor\n    height: 70\n-\n    name: francis\n    occupation: conductor\n    height: 63\n'
        assert.equal(fs.readFileSync(filePath.join(path.sep), 'utf-8'), testString)
        assert.equal(dataString, testString)
        rimraf(filePath.slice(0, 2).join(path.sep), {glob: false}, function (err) {
          assert.equal(err, null)
          done()
        })
      })
    })

    describe('yml', function () {
      it('should write as yml', function (done) {
        var filePath = ['test', 'tmp-write-data-yml-sync', 'data.yml']
        io.writeDataSync(filePath.join(path.sep), testData[0], {makeDirectories: true})
        readAssertBasicValidObject(filePath.join(path.sep))
        rimraf(filePath.slice(0, 2).join(path.sep), {glob: false}, function (err) {
          assert.equal(err, null)
          done()
        })
      })

      it('should write as yml with indent', function (done) {
        var filePath = ['test', 'tmp-write-data-yml-indent-sync', 'data.yml']
        var dataString = io.writeDataSync(filePath.join(path.sep), testData, {
          makeDirectories: true,
          indent: 4
        })
        var testString = '-\n    name: jim\n    occupation: land surveyor\n    height: 70\n-\n    name: francis\n    occupation: conductor\n    height: 63\n'
        assert.equal(fs.readFileSync(filePath.join(path.sep), 'utf-8'), testString)
        assert.equal(dataString, testString)
        rimraf(filePath.slice(0, 2).join(path.sep), {glob: false}, function (err) {
          assert.equal(err, null)
          done()
        })
      })
    })
  })

  describe('appendData()', function () {
    describe('json', function () {
      it('should append to existing json', function (done) {
        var filePath = ['test', 'tmp-append-data-json', 'data.json']
        io.writeDataSync(filePath.join(path.sep), [testData[0]], {makeDirectories: true})
        io.appendData(filePath.join(path.sep), [testData[1]], function (err) {
          assert.equal(err, null)
          readAssertBasicValid(filePath.join(path.sep))
          rimraf(filePath.slice(0, 2).join(path.sep), {glob: false}, function (err) {
            assert.equal(err, null)
            done()
          })
        })
      })
    })

    describe('geojson', function () {
      it('should append to existing geojson', function (done) {
        var filePath = ['test', 'tmp-append-data-geojson', 'data.geojson']
        io.writeDataSync(filePath.join(path.sep), [testData[0]], {makeDirectories: true})
        io.appendData(filePath.join(path.sep), [testData[1]], function (err) {
          assert.equal(err, null)
          readAssertBasicValid(filePath.join(path.sep))
          rimraf(filePath.slice(0, 2).join(path.sep), {glob: false}, function (err) {
            assert.equal(err, null)
            done()
          })
        })
      })
    })

    describe('topojson', function () {
      it('should append to existing topojson', function (done) {
        var filePath = ['test', 'tmp-append-data-topojson', 'data.topojson']
        io.writeDataSync(filePath.join(path.sep), [testData[0]], {makeDirectories: true})
        io.appendData(filePath.join(path.sep), [testData[1]], function (err) {
          assert.equal(err, null)
          readAssertBasicValid(filePath.join(path.sep))
          rimraf(filePath.slice(0, 2).join(path.sep), {glob: false}, function (err) {
            assert.equal(err, null)
            done()
          })
        })
      })
    })

    describe('csv', function () {
      it('should append to existing csv', function (done) {
        var filePath = ['test', 'tmp-append-data-csv', 'data.csv']
        io.writeDataSync(filePath.join(path.sep), [testData[0]], {makeDirectories: true})
        io.appendData(filePath.join(path.sep), [testData[1]], function (err) {
          assert.equal(err, null)
          readAssertBasicValid(filePath.join(path.sep))
          rimraf(filePath.slice(0, 2).join(path.sep), {glob: false}, function (err) {
            assert.equal(err, null)
            done()
          })
        })
      })
    })

    describe('tsv', function () {
      it('should append to existing tsv', function (done) {
        var filePath = ['test', 'tmp-append-data-tsv', 'data.tsv']
        io.writeDataSync(filePath.join(path.sep), [testData[0]], {makeDirectories: true})
        io.appendData(filePath.join(path.sep), [testData[1]], function (err) {
          assert.equal(err, null)
          readAssertBasicValid(filePath.join(path.sep))
          rimraf(filePath.slice(0, 2).join(path.sep), {glob: false}, function (err) {
            assert.equal(err, null)
            done()
          })
        })
      })
    })

    describe('psv', function () {
      it('should append to existing psv', function (done) {
        var filePath = ['test', 'tmp-append-data-psv', 'data.psv']
        io.writeDataSync(filePath.join(path.sep), [testData[0]], {makeDirectories: true})
        io.appendData(filePath.join(path.sep), [testData[1]], function (err) {
          assert.equal(err, null)
          readAssertBasicValid(filePath.join(path.sep))
          rimraf(filePath.slice(0, 2).join(path.sep), {glob: false}, function (err) {
            assert.equal(err, null)
            done()
          })
        })
      })
    })

    describe('json', function () {
      it('should append to non-existent json', function (done) {
        var filePath = ['test', 'tmp-append-new-data-json', 'data.json']
        io.appendData(filePath.join(path.sep), testData, {makeDirectories: true}, function (err) {
          assert.equal(err, null)
          readAssertBasicValid(filePath.join(path.sep))
          rimraf(filePath.slice(0, 2).join(path.sep), {glob: false}, function (err) {
            assert.equal(err, null)
            done()
          })
        })
      })
    })

    describe('geojson', function () {
      it('should append to non-existent geojson', function (done) {
        var filePath = ['test', 'tmp-append-new-data-geojson', 'data.geojson']
        io.appendData(filePath.join(path.sep), testData, {makeDirectories: true}, function (err) {
          assert.equal(err, null)
          readAssertBasicValid(filePath.join(path.sep))
          rimraf(filePath.slice(0, 2).join(path.sep), {glob: false}, function (err) {
            assert.equal(err, null)
            done()
          })
        })
      })
    })

    describe('topojson', function () {
      it('should append to non-existent topojson', function (done) {
        var filePath = ['test', 'tmp-append-new-data-topojson', 'data.topojson']
        io.appendData(filePath.join(path.sep), testData, {makeDirectories: true}, function (err) {
          assert.equal(err, null)
          readAssertBasicValid(filePath.join(path.sep))
          rimraf(filePath.slice(0, 2).join(path.sep), {glob: false}, function (err) {
            assert.equal(err, null)
            done()
          })
        })
      })
    })

    describe('csv', function () {
      it('should append to non-existent csv', function (done) {
        var filePath = ['test', 'tmp-append-new-data-csv', 'data.csv']
        io.appendData(filePath.join(path.sep), testData, {makeDirectories: true}, function (err) {
          assert.equal(err, null)
          readAssertBasicValid(filePath.join(path.sep))
          rimraf(filePath.slice(0, 2).join(path.sep), {glob: false}, function (err) {
            assert.equal(err, null)
            done()
          })
        })
      })
    })

    describe('tsv', function () {
      it('should append to non-existent tsv', function (done) {
        var filePath = ['test', 'tmp-append-new-data-tsv', 'data.tsv']
        io.appendData(filePath.join(path.sep), testData, {makeDirectories: true}, function (err) {
          assert.equal(err, null)
          readAssertBasicValid(filePath.join(path.sep))
          rimraf(filePath.slice(0, 2).join(path.sep), {glob: false}, function (err) {
            assert.equal(err, null)
            done()
          })
        })
      })
    })

    describe('psv', function () {
      it('should append to non-existent psv', function (done) {
        var filePath = ['test', 'tmp-append-new-data-psv', 'data.psv']
        io.appendData(filePath.join(path.sep), testData, {makeDirectories: true}, function (err) {
          assert.equal(err, null)
          readAssertBasicValid(filePath.join(path.sep))
          rimraf(filePath.slice(0, 2).join(path.sep), {glob: false}, function (err) {
            assert.equal(err, null)
            done()
          })
        })
      })
    })

    describe('yaml', function () {
      it('should append to existing yaml', function (done) {
        var filePath = ['test', 'tmp-append-data-yaml', 'data.yaml']
        io.writeDataSync(filePath.join(path.sep), testData[0], {makeDirectories: true})
        io.appendData(filePath.join(path.sep), testData[1], function (err) {
          assert.equal(err, null)
          readAssertBasicValidObject(filePath.join(path.sep), 1)
          rimraf(filePath.slice(0, 2).join(path.sep), {glob: false}, function (err) {
            assert.equal(err, null)
            done()
          })
        })
      })
    })

    describe('yaml', function () {
      it('should append to non-existent yaml', function (done) {
        var filePath = ['test', 'tmp-append-new-data-yaml', 'data.yaml']
        io.appendData(filePath.join(path.sep), testData[1], {makeDirectories: true}, function (err) {
          assert.equal(err, null)
          readAssertBasicValidObject(filePath.join(path.sep), 1)
          rimraf(filePath.slice(0, 2).join(path.sep), {glob: false}, function (err) {
            assert.equal(err, null)
            done()
          })
        })
      })
    })

    describe('json-object', function () {
      it('should append to existing json-object', function (done) {
        var filePath = ['test', 'tmp-append-data-json-object', 'data.json']
        io.writeDataSync(filePath.join(path.sep), testData[0], {makeDirectories: true})
        io.appendData(filePath.join(path.sep), testData[1], function (err) {
          assert.equal(err, null)
          readAssertBasicValidObject(filePath.join(path.sep), 1)
          rimraf(filePath.slice(0, 2).join(path.sep), {glob: false}, function (err) {
            assert.equal(err, null)
            done()
          })
        })
      })
    })

    describe('json-object', function () {
      it('should append to non-existent json-object', function (done) {
        var filePath = ['test', 'tmp-append-new-data-json-object', 'data.json']
        io.appendData(filePath.join(path.sep), testData[1], {makeDirectories: true}, function (err) {
          assert.equal(err, null)
          readAssertBasicValidObject(filePath.join(path.sep), 1)
          rimraf(filePath.slice(0, 2).join(path.sep), {glob: false}, function (err) {
            assert.equal(err, null)
            done()
          })
        })
      })
    })
  })

  describe('appendDataSync()', function () {
    describe('json', function () {
      it('should append to existing json', function (done) {
        var filePath = ['test', 'tmp-append-data-json-sync', 'data.json']
        io.writeDataSync(filePath.join(path.sep), [testData[0]], {makeDirectories: true})
        io.appendDataSync(filePath.join(path.sep), [testData[1]])
        readAssertBasicValid(filePath.join(path.sep))
        rimraf(filePath.slice(0, 2).join(path.sep), {glob: false}, function (err) {
          assert.equal(err, null)
          done()
        })
      })
    })

    describe('geojson', function () {
      it('should append to existing geojson', function (done) {
        var filePath = ['test', 'tmp-append-data-geojson-sync', 'data.geojson']
        io.writeDataSync(filePath.join(path.sep), [testData[0]], {makeDirectories: true})
        io.appendDataSync(filePath.join(path.sep), [testData[1]])
        readAssertBasicValid(filePath.join(path.sep))
        rimraf(filePath.slice(0, 2).join(path.sep), {glob: false}, function (err) {
          assert.equal(err, null)
          done()
        })
      })
    })

    describe('topojson', function () {
      it('should append to existing topojson', function (done) {
        var filePath = ['test', 'tmp-append-data-topojson-sync', 'data.topojson']
        io.writeDataSync(filePath.join(path.sep), [testData[0]], {makeDirectories: true})
        io.appendDataSync(filePath.join(path.sep), [testData[1]])
        readAssertBasicValid(filePath.join(path.sep))
        rimraf(filePath.slice(0, 2).join(path.sep), {glob: false}, function (err) {
          assert.equal(err, null)
          done()
        })
      })
    })

    describe('csv', function () {
      it('should append to existing csv', function (done) {
        var filePath = ['test', 'tmp-append-data-csv-sync', 'data.csv']
        io.writeDataSync(filePath.join(path.sep), [testData[0]], {makeDirectories: true})
        io.appendDataSync(filePath.join(path.sep), [testData[1]])
        readAssertBasicValid(filePath.join(path.sep))
        rimraf(filePath.slice(0, 2).join(path.sep), {glob: false}, function (err) {
          assert.equal(err, null)
          done()
        })
      })
    })

    describe('tsv', function () {
      it('should append to existing tsv', function (done) {
        var filePath = ['test', 'tmp-append-data-tsv-sync', 'data.tsv']
        io.writeDataSync(filePath.join(path.sep), [testData[0]], {makeDirectories: true})
        io.appendDataSync(filePath.join(path.sep), [testData[1]])
        readAssertBasicValid(filePath.join(path.sep))
        rimraf(filePath.slice(0, 2).join(path.sep), {glob: false}, function (err) {
          assert.equal(err, null)
          done()
        })
      })
    })

    describe('psv', function () {
      it('should append to existing psv', function (done) {
        var filePath = ['test', 'tmp-append-data-psv', 'data.psv']
        io.writeDataSync(filePath.join(path.sep), [testData[0]], {makeDirectories: true})
        io.appendDataSync(filePath.join(path.sep), [testData[1]])
        readAssertBasicValid(filePath.join(path.sep))
        rimraf(filePath.slice(0, 2).join(path.sep), {glob: false}, function (err) {
          assert.equal(err, null)
          done()
        })
      })
    })

    describe('json', function () {
      it('should append to non-existent json', function (done) {
        var filePath = ['test', 'tmp-append-new-data-json-sync', 'data.json']
        io.appendDataSync(filePath.join(path.sep), testData, {makeDirectories: true})
        readAssertBasicValid(filePath.join(path.sep))
        rimraf(filePath.slice(0, 2).join(path.sep), {glob: false}, function (err) {
          assert.equal(err, null)
          done()
        })
      })
    })

    describe('geojson', function () {
      it('should append to non-existent geojson', function (done) {
        var filePath = ['test', 'tmp-append-new-data-geojson-sync', 'data.geojson']
        io.appendDataSync(filePath.join(path.sep), testData, {makeDirectories: true})
        readAssertBasicValid(filePath.join(path.sep))
        rimraf(filePath.slice(0, 2).join(path.sep), {glob: false}, function (err) {
          assert.equal(err, null)
          done()
        })
      })
    })

    describe('topojson', function () {
      it('should append to non-existent topojson', function (done) {
        var filePath = ['test', 'tmp-append-new-data-topojson-sync', 'data.topojson']
        io.appendDataSync(filePath.join(path.sep), testData, {makeDirectories: true})
        readAssertBasicValid(filePath.join(path.sep))
        rimraf(filePath.slice(0, 2).join(path.sep), {glob: false}, function (err) {
          assert.equal(err, null)
          done()
        })
      })
    })

    describe('csv', function () {
      it('should append to non-existent csv', function (done) {
        var filePath = ['test', 'tmp-append-new-data-csv-sync', 'data.csv']
        io.appendDataSync(filePath.join(path.sep), testData, {makeDirectories: true})
        readAssertBasicValid(filePath.join(path.sep))
        rimraf(filePath.slice(0, 2).join(path.sep), {glob: false}, function (err) {
          assert.equal(err, null)
          done()
        })
      })
    })

    describe('tsv', function () {
      it('should append to non-existent tsv', function (done) {
        var filePath = ['test', 'tmp-append-new-data-tsv-sync', 'data.tsv']
        io.appendDataSync(filePath.join(path.sep), testData, {makeDirectories: true})
        readAssertBasicValid(filePath.join(path.sep))
        rimraf(filePath.slice(0, 2).join(path.sep), {glob: false}, function (err) {
          assert.equal(err, null)
          done()
        })
      })
    })

    describe('psv', function () {
      it('should append to non-existent psv', function (done) {
        var filePath = ['test', 'tmp-append-new-data-psv-sync', 'data.psv']
        io.appendDataSync(filePath.join(path.sep), testData, {makeDirectories: true})
        readAssertBasicValid(filePath.join(path.sep))
        rimraf(filePath.slice(0, 2).join(path.sep), {glob: false}, function (err) {
          assert.equal(err, null)
          done()
        })
      })
    })

    describe('yaml', function () {
      it('should append to existing yaml', function (done) {
        var filePath = ['test', 'tmp-append-data-yaml-sync', 'data.yaml']
        io.writeDataSync(filePath.join(path.sep), testData[0], {makeDirectories: true})
        io.appendDataSync(filePath.join(path.sep), testData[1])
        readAssertBasicValidObject(filePath.join(path.sep), 1)
        rimraf(filePath.slice(0, 2).join(path.sep), {glob: false}, function (err) {
          assert.equal(err, null)
          done()
        })
      })
    })

    describe('yaml', function () {
      it('should append to non-existent yaml', function (done) {
        var filePath = ['test', 'tmp-append-new-data-yaml-sync', 'data.yaml']
        io.appendDataSync(filePath.join(path.sep), testData[1], {makeDirectories: true})
        readAssertBasicValidObject(filePath.join(path.sep), 1)
        rimraf(filePath.slice(0, 2).join(path.sep), {glob: false}, function (err) {
          assert.equal(err, null)
          done()
        })
      })
    })

    describe('json-object', function () {
      it('should append to existing json-object', function (done) {
        var filePath = ['test', 'tmp-append-data-json-object-sync', 'data.json']
        io.writeDataSync(filePath.join(path.sep), testData[0], {makeDirectories: true})
        io.appendDataSync(filePath.join(path.sep), testData[1])
        readAssertBasicValidObject(filePath.join(path.sep), 1)
        rimraf(filePath.slice(0, 2).join(path.sep), {glob: false}, function (err) {
          assert.equal(err, null)
          done()
        })
      })
    })

    describe('json-object', function () {
      it('should append to non-existent json-object', function (done) {
        var filePath = ['test', 'tmp-append-new-data-json-object-sync', 'data.json']
        io.appendDataSync(filePath.join(path.sep), testData[1], {makeDirectories: true})
        readAssertBasicValidObject(filePath.join(path.sep), 1)
        rimraf(filePath.slice(0, 2).join(path.sep), {glob: false}, function (err) {
          assert.equal(err, null)
          done()
        })
      })
    })
  })

  describe('convertDbfToData()', function () {
    describe('csv', function () {
      it('should convert to format', function (done) {
        var filePath = ['test', 'tmp-convert-dbf-to-data-csv', 'data.csv']
        io.convertDbfToData(testDataPath('dbf/basic.dbf'), filePath.join(path.sep), {makeDirectories: true}, function (err) {
          assert.equal(err, null)
          var json = io.readDataSync(filePath.join(path.sep))
          assert(_.isEqual(JSON.stringify(json), '[{"foo":"orange","bar":"0"},{"foo":"blue","bar":"1"},{"foo":"green","bar":"2"}]'))
          rimraf(filePath.slice(0, 2).join(path.sep), {glob: false}, function (err) {
            assert.equal(err, null)
            done()
          })
        })
      })
    })

    describe('psv', function () {
      it('should convert to format', function (done) {
        var filePath = ['test', 'tmp-convert-dbf-to-data-psv', 'data.psv']
        io.convertDbfToData(testDataPath('dbf/basic.dbf'), filePath.join(path.sep), {makeDirectories: true}, function (err) {
          assert.equal(err, null)
          var json = io.readDataSync(filePath.join(path.sep))
          assert(_.isEqual(JSON.stringify(json), '[{"foo":"orange","bar":"0"},{"foo":"blue","bar":"1"},{"foo":"green","bar":"2"}]'))
          rimraf(filePath.slice(0, 2).join(path.sep), {glob: false}, function (err) {
            assert.equal(err, null)
            done()
          })
        })
      })
    })

    describe('tsv', function () {
      it('should convert to format', function (done) {
        var filePath = ['test', 'tmp-convert-dbf-to-data-tsv', 'data.tsv']
        io.convertDbfToData(testDataPath('dbf/basic.dbf'), filePath.join(path.sep), {makeDirectories: true}, function (err) {
          assert.equal(err, null)
          var json = io.readDataSync(filePath.join(path.sep))
          assert(_.isEqual(JSON.stringify(json), '[{"foo":"orange","bar":"0"},{"foo":"blue","bar":"1"},{"foo":"green","bar":"2"}]'))
          rimraf(filePath.slice(0, 2).join(path.sep), {glob: false}, function (err) {
            assert.equal(err, null)
            done()
          })
        })
      })
    })

    describe('yaml', function () {
      it('should convert to format', function (done) {
        var filePath = ['test', 'tmp-convert-dbf-to-data-yaml', 'data.yaml']
        io.convertDbfToData(testDataPath('dbf/basic.dbf'), filePath.join(path.sep), {makeDirectories: true}, function (err) {
          assert.equal(err, null)
          var json = io.readDataSync(filePath.join(path.sep))
          assert(_.isEqual(JSON.stringify(json), '[{"foo":"orange","bar":0},{"foo":"blue","bar":1},{"foo":"green","bar":2}]'))
          rimraf(filePath.slice(0, 2).join(path.sep), {glob: false}, function (err) {
            assert.equal(err, null)
            done()
          })
        })
      })
    })

    describe('yml', function () {
      it('should convert to format', function (done) {
        var filePath = ['test', 'tmp-convert-dbf-to-data-yml', 'data.yml']
        io.convertDbfToData(testDataPath('dbf/basic.dbf'), filePath.join(path.sep), {makeDirectories: true}, function (err) {
          assert.equal(err, null)
          var json = io.readDataSync(filePath.join(path.sep))
          assert(_.isEqual(JSON.stringify(json), '[{"foo":"orange","bar":0},{"foo":"blue","bar":1},{"foo":"green","bar":2}]'))
          rimraf(filePath.slice(0, 2).join(path.sep), {glob: false}, function (err) {
            assert.equal(err, null)
            done()
          })
        })
      })
    })

    describe('json', function () {
      it('should convert to format', function (done) {
        var filePath = ['test', 'tmp-convert-dbf-to-data-json', 'data.json']
        io.convertDbfToData(testDataPath('dbf/basic.dbf'), filePath.join(path.sep), {makeDirectories: true}, function (err) {
          assert.equal(err, null)
          var json = io.readDataSync(filePath.join(path.sep))
          assert(_.isEqual(JSON.stringify(json), '[{"foo":"orange","bar":0},{"foo":"blue","bar":1},{"foo":"green","bar":2}]'))
          rimraf(filePath.slice(0, 2).join(path.sep), {glob: false}, function (err) {
            assert.equal(err, null)
            done()
          })
        })
      })
    })
  })
})
