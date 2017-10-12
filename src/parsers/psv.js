/* istanbul ignore next */
import dsvFormat from 'd3-dsv/src/dsv'

export default function (str, parserOptions) {
  parserOptions = parserOptions || {}
  return dsvFormat('|').parse(str, parserOptions.map)
}
