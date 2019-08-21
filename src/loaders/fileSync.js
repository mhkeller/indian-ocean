/* istanbul ignore next */
import fs from 'fs'
import discernFormat from '../helpers/discernFormat'
import {formatsIndex} from '../config/equivalentFormats'
import stripBom from '../utils/stripBom'

export default function file (filePath, parser, parserOptions, cb) {
  var data = fs.readFileSync(filePath, 'utf8')
  var fileFormat = discernFormat(filePath)
  if ((fileFormat === 'json' || formatsIndex.json.indexOf(fileFormat) > -1) && data === '') {
    data = '[]'
  }

  data = stripBom(data)
  var parsed
  if (typeof parser === 'function') {
    parsed = parser(data, parserOptions)
  } else if (typeof parser === 'object' && typeof parser.parse === 'function') {
    parsed = parser.parse(data, parserOptions)
  } else {
    return new Error('Your specified parser is not properly formatted. It must either be a function or have a `parse` method.')
  }

  return parsed
}
