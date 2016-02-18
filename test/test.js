/* global describe, it */

var io = require('../lib/index')
var chai = require('chai')
var assert = chai.assert
var path = require('path')
var _ = require('underscore')

function testDataPath (name) {
  return path.join(__dirname, 'data', name)
}

function assertBasicValid (json) {
  assert.lengthOf(json, 2)
  assert.typeOf(json[0], 'object')
  assert(_.isEqual(_.keys(json[0]), ['name', 'occupation', 'height']), 'headers match keys')
}

describe('readCsvSync()', function () {
  describe('empty', function () {
    it('should be empty', function () {
      assert.lengthOf(io.readCsvSync(testDataPath('csv/empty.csv')), 0)
    })
  })

  describe('basic', function () {
    it('should match expected json', function () {
      var json = io.readCsvSync(testDataPath('csv/basic.csv'))
      assertBasicValid(json)
    })
  })
})

describe('readDataSync()', function () {
  describe('csv', function () {
    it('should match expected json', function () {
      var json = io.readDataSync(testDataPath('csv/basic.csv'))
      assertBasicValid(json)
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
      assertBasicValid(json)
    })
  })

  describe('tsv', function () {
    it('should match expected json', function () {
      var json = io.readDataSync(testDataPath('tsv/basic.tsv'))
      assertBasicValid(json)
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
    it('should match expected json', function () {
      var txt = io.readTxtSync(testDataPath('txt/basic.txt'))
      assert(_.isEqual(txt, 'The carbon in our apple pies billions upon billions cosmos. Extraplanetary Hypatia. Tendrils of gossamer clouds? Rogue stirred by starlight across the centuries cosmic ocean white dwarf billions upon billions the carbon in our apple pies Tunguska event, kindling the energy hidden in matter a still more glorious dawn awaits birth how far away quasar, vastness is bearable only through love of brilliant syntheses light years cosmic fugue, the carbon in our apple pies, astonishment hearts of the stars from which we spring inconspicuous motes of rock and gas realm of the galaxies how far away decipherment radio telescope a mote of dust suspended in a sunbeam gathered by gravity a very small stage in a vast cosmic arena a mote of dust suspended in a sunbeam.'))
    })
  })
})

describe('readYamlSync()', function () {
  describe('empty', function () {
    it('should be empty', function () {
      var json = io.readYamlSync(testDataPath('yaml/empty.yaml'))
      assert(_.isUndefined(json))
    })
  })

  describe('basic', function () {
    it('should match expected json', function () {
      var json = io.readYamlSync(testDataPath('yaml/basic.yaml'))
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

describe('readYamlSync()', function () {
  describe('empty', function () {
    it('should be empty', function () {
      var json = io.readYamlSync(testDataPath('yml/empty.yml'))
      assert(_.isUndefined(json))
    })
  })

  describe('basic', function () {
    it('should match expected json', function () {
      var json = io.readYamlSync(testDataPath('yml/basic.yml'))
      assert(_.isEqual(JSON.stringify(json), '{"name":"jim","occupation":"land surveyor","height":70}'))
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

describe('readdirFilter()', function () {
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

describe('discernFormat()', function () {
  describe('no extension', function () {
    it('should be false', function () {
      assert.equal(io.discernFormat('/fake/path/what_is_this_file'), false)
    })
  })

  describe('csv', function () {
    it('should be a csv', function () {
      assert.equal(io.discernFormat('/fake/path/real.csv'), 'csv')
    })
  })

  describe('json', function () {
    it('should be a json', function () {
      assert.equal(io.discernFormat('/fake/path/real.json'), 'json')
    })
  })

  describe('geojson', function () {
    it('should be a json', function () {
      assert.equal(io.discernFormat('/fake/path/real.geojson'), 'json')
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

describe('existsSync()', function () {
  var dir = path.join(__dirname, 'data', 'csv')
  describe('exists', function () {
    it('should be equal', function () {
      var exists = io.existsSync(path.join(dir, 'basic.csv'))
      assert.equal(exists, true)
    })
  })
  describe('does not exist', function () {
    it('should be equal', function () {
      var exists = io.existsSync(path.join(dir, 'doesnt-exist.csv'))
      assert.equal(exists, false)
    })
  })
})

describe('exists()', function () {
  describe('exists', function () {
    it('should be equal', function (done) {
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
    it('should be equal', function (done) {
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
