var shapefile = require('shapefile')
import identity from '../utils/identity'

export default function readDbf (filePath, opts_, cb) {
  var parserOptions = {
    map: identity
  }
  if (typeof cb === 'undefined') {
    cb = opts_
  } else {
    parserOptions = typeof opts_ === 'function' ? {map: opts_} : opts_
  }
  var values = []
  shapefile.openDbf(filePath)
    .then(source => source.read()
      .then(function log (result) {
        if (result.done) return cb(null, values)
        values.push(parserOptions.map(result.value))
        return source.read().then(log)
      }))
    .catch(error => cb(error.stack))
}
