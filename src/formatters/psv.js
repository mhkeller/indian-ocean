/* istanbul ignore next */
import dsvFormat from 'd3-dsv/src/dsv'
import formattingPreflight from '../utils/formattingPreflight'
import parseError from '../reporters/parseError'

export default function (file, writeOptions) {
  writeOptions = writeOptions || {}
  file = formattingPreflight(file, 'psv')
  try {
    return dsvFormat('|').format(file, writeOptions.columns)
  } catch (err) {
    parseError('psv')
  }
}
