/* istanbul ignore next */
import { csvParse } from 'd3-dsv/src/csv'
import { stripBom } from 'strip-bom'

export default function (str, parserOptions) {
  parserOptions = parserOptions || {}
  return csvParse(stripBom(str), parserOptions.map)
}
