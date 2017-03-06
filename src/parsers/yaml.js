import yamlParser from 'js-yaml'
import identity from '../utils/identity'

export default function (str, parserOptions) {
  parserOptions = parserOptions || {}
  var map = parserOptions.map || identity
  delete parserOptions.map
  var loadMethod = parserOptions.loadMethod || 'safeLoad'
  delete parserOptions.loadMethod
  var data = yamlParser[loadMethod](str, parserOptions) || {}
  return map(data, map)
}
