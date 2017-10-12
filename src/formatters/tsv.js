/* istanbul ignore next */
import {tsvFormat} from 'd3-dsv/src/tsv'
import formattingPreflight from '../utils/formattingPreflight'
import parseError from '../reporters/parseError'

export default function (file, writeOptions) {
  writeOptions = writeOptions || {}
  file = formattingPreflight(file, 'tsv')
  try {
    return tsvFormat(file, writeOptions.columns)
  } catch (err) {
    parseError('tsv')
  }
}
