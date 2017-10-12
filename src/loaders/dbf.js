/* istanbul ignore next */
var shapefile = require('shapefile')
import identity from '../utils/identity'

export default function dbf (filePath, parser, parserOptions, cb) {
  var values = []
  parserOptions = parserOptions || {}
  var map = parserOptions.map || identity
  var i = 0
  shapefile.openDbf(filePath)
    .then(source => source.read()
      .then(function log (result) {
        i++
        if (result.done) return cb(null, values)
        values.push(map(result.value, i))
        return source.read().then(log)
      }))
    .catch(error => cb(error.stack))
}
