/* istanbul ignore next */
import archieml from 'archieml'
import identity from '../utils/identity'
import omit from '../utils/omit'

export default function (str, parserOptions) {
  parserOptions = parserOptions || {}
  var map = parserOptions.map || identity
  var data = archieml.load(str, omit(parserOptions, ['map']))
  return map(data)
}
