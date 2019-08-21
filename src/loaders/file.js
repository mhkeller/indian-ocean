/* istanbul ignore next */
import fs from 'fs'
import discernFormat from '../helpers/discernFormat'
import {formatsIndex} from '../config/equivalentFormats'
import stripBom from '../utils/stripBom'

export default function file (filePath, parser, parserOptions, cb) {
  fs.readFile(filePath, 'utf8', function (err, data) {
    var fileFormat = discernFormat(filePath)
    if ((fileFormat === 'json' || formatsIndex.json.indexOf(fileFormat) > -1) && data === '') {
      data = '[]'
    }
    if (err) {
      cb(err)
      return false
    }
    var parsed
    try {
      data = stripBom(data)
      if (typeof parser === 'function') {
        parsed = parser(data, parserOptions)
      } else if (typeof parser === 'object' && typeof parser.parse === 'function') {
        parsed = parser.parse(data, parserOptions)
      } else {
        parsed = 'Your specified parser is not properly formatted. It must either be a function or have a `parse` method.'
      }
    } catch (err) {
      cb(err)
      return
    }
    cb(null, parsed)
  })
}
