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

describe('readdirInclude()', function () {
  describe('empty', function () {
    it('should be empty', function (done) {
      io.readdirInclude(__dirname, 'csv', function (err, files) {
        assert.lengthOf(files, 0)
        if (err) {
          console.log(err)
        }
        done()
      })
    })
  })

  describe('actual extension', function () {
    it('should find csv files', function (done) {
      var dir = path.join(__dirname, 'data', 'csv')
      io.readdirInclude(dir, 'csv', function (err, files) {
        assert.isAbove(files.length, 0)
        if (err) {
          console.log(err)
        }
        done()
      })
    })
  })

  describe('actual extension', function () {
    it('should find csv files', function (done) {
      var dir = path.join(__dirname, 'data', 'csv')
      io.readdirInclude(dir, 'csv', function (err, files) {
        assert.isAbove(files.length, 0)
        if (err) {
          console.log(err)
        }
        done()
      })
    })
  })

  describe('actual extension', function () {
    it('should find csv files given list of one', function (done) {
      var dir = path.join(__dirname, 'data', 'csv')
      io.readdirInclude(dir, ['csv'], function (err, files) {
        assert.isAbove(files.length, 0)
        if (err) {
          console.log(err)
        }
        done()
      })
    })
  })

  // TODO, do this one
  // describe('actual extension', function () {
  //   it('should find txt and csv files', function (done) {
  //     var dir = path.join(__dirname, 'data', 'mixed')
  //     io.readdirInclude(dir, ['csv', 'tsv'], function (err, files) {
  //       assert.isAbove(files.length, 0)
  //       if (err) {
  //         console.log(err)
  //       }
  //       done()
  //     })
  //   })
  // })

  describe('extension in filename', function () {
    it('should be empty', function (done) {
      var dir = path.join(__dirname, 'data', 'json')
      io.readdirInclude(dir, 'csv', function (err, files) {
        assert.lengthOf(files, 0)
        if (err) {
          console.log(err)
        }
        done()
      })
    })
  })

  describe('dirPath in filename', function () {
    it('should match expected output', function (done) {
      var dir = path.join(__dirname, 'data', 'csv')
      io.readdirInclude(dir, 'csv', true, function (err, files) {
        if (err) {
          console.log(err)
        }
        done(assert.equal(files.indexOf(path.join(dir, 'basic.csv')), 0))
      })
    })
  })
})

describe('readdirIncludeSync()', function () {
  describe('empty', function () {
    it('should be empty', function () {
      assert.lengthOf(io.readdirIncludeSync(__dirname, 'csv'), 0)
    })
  })

  describe('actual extension', function () {
    it('should not be empty', function () {
      var dir = path.join(__dirname, 'data', 'csv')
      assert.isAbove(io.readdirIncludeSync(dir, 'csv').length, 0)
    })
  })

  describe('extension in filename', function () {
    it('should be empty', function () {
      var dir = path.join(__dirname, 'data', 'json')
      assert.lengthOf(io.readdirIncludeSync(dir, 'csv'), 0)
    })
  })

  describe('dirPath in filename', function () {
    it('should match expected output', function () {
      var dir = path.join(__dirname, 'data', 'csv')
      var files = io.readdirIncludeSync(dir, 'csv', true)
      assert.equal(files.indexOf(path.join(dir, 'basic.csv')), 0)
    })
  })
})

describe('readdirExclude()', function () {
  describe('all files match', function () {
    it('should be empty', function (done) {
      var dir = path.join(__dirname, 'data', 'csv')
      io.readdirExclude(dir, 'csv', function (err, files) {
        assert.lengthOf(files, 0)
        if (err) {
          console.error(err)
        }
        done()
      })
    })
  })

  describe('no matching files', function () {
    it('should not be empty', function (done) {
      var dir = path.join(__dirname, 'data', 'csv')
      io.readdirExclude(dir, 'tsv', function (err, files) {
        assert.isAbove(files.length, 0)
        if (err) {
          console.error(err)
        }
        done()
      })
    })
  })

  describe('extension in filename', function () {
    it('should not be empty', function (done) {
      var dir = path.join(__dirname, 'data', 'other')
      io.readdirExclude(dir, 'csv', function (err, files) {
        assert.isAbove(files.length, 0)
        if (err) {
          console.error(err)
        }
        done()
      })
    })
  })

  describe('dirPath in filename', function () {
    it('should match expected output', function (done) {
      var dir = path.join(__dirname, 'data', 'mixed')
      io.readdirExclude(dir, 'txt', true, function (err, files) {
        if (err) {
          console.log(err)
        }
        done(assert.equal(files.indexOf(path.join(dir, 'this_is_not_a_txt.csv')), 0))
      })
    })
  })
})

describe('readdirExcludeSync()', function () {
  describe('all files match', function () {
    it('should be empty', function () {
      var dir = path.join(__dirname, 'data', 'csv')
      assert.lengthOf(io.readdirExcludeSync(dir, 'csv'), 0)
    })
  })

  describe('no matching files', function () {
    it('should not be empty', function () {
      var dir = path.join(__dirname, 'data', 'csv')
      assert.isAbove(io.readdirExcludeSync(dir, 'tsv').length, 0)
    })
  })

  describe('extension in filename', function () {
    it('should not be empty', function () {
      var dir = path.join(__dirname, 'data', 'mixed')
      assert.isAbove(io.readdirExcludeSync(dir, 'csv').length, 0)
    })
  })

  describe('dirPath in filename', function () {
    it('should match expected output', function () {
      var dir = path.join(__dirname, 'data', 'mixed')
      var files = io.readdirExcludeSync(dir, 'csv', true)
      assert.equal(files.indexOf(path.join(dir, 'this_is_not_a_csv.txt')), 0)
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
