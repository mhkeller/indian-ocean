import identity from '../utils/identity'
import archieml from 'archieml'

export default function (str, parserOptions) {
  parserOptions = parserOptions || {}
  var map = parserOptions.map || identity
  delete parserOptions.map
  var data = archieml.load(str, parserOptions)
  return map(data)
}
