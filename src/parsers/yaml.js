/* istanbul ignore next */
import yamlParser from 'js-yaml'
import identity from '../utils/identity'
import omit from '../utils/omit'

export default function (str, parserOptions) {
  parserOptions = parserOptions || {}
  var map = parserOptions.map || identity
  var loadMethod = parserOptions.loadMethod || 'safeLoad'
  var data = yamlParser[loadMethod](str, omit(parserOptions, ['map', 'loadMethod'])) || {}
  return map(data, map)
}
