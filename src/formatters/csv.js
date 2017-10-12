/* istanbul ignore next */
import {csvFormat} from 'd3-dsv/src/csv'
import formattingPreflight from '../utils/formattingPreflight'
import parseError from '../reporters/parseError'

export default function (file, writeOptions) {
  writeOptions = writeOptions || {}
  file = formattingPreflight(file, 'csv')
  try {
    return csvFormat(file, writeOptions.columns)
  } catch (err) {
    parseError('csv')
  }
}
