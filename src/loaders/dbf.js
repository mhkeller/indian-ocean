var shapefile = require('shapefile')

export default function dbf (filePath, parser, parserOptions, cb) {
  var values = []
  shapefile.openDbf(filePath)
    .then(source => source.read()
      .then(function log (result) {
        if (result.done) return cb(null, values)
        values.push(parserOptions.map(result.value)) // TODO, figure out i
        return source.read().then(log)
      }))
    .catch(error => cb(error.stack))
}
