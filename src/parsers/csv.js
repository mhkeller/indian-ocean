/* istanbul ignore next */
import {csvParse} from 'd3-dsv/src/csv'

export default function (str, parserOptions) {
  parserOptions = parserOptions || {}
  return csvParse(str, parserOptions.map)
}
