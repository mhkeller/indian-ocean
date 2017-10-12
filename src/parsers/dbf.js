/* istanbul ignore next */
import parseDBF from 'parsedbf'
import identity from '../utils/identity'

export default function (str, parserOptions) {
  parserOptions = parserOptions || {}
  return parseDBF(str).map(parserOptions.map || identity)
}
