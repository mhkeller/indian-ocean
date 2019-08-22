import file from './file'
import fileSync from './fileSync'
import dbf from './dbf'
import {formatsList} from '../config/equivalentFormats'

let loaders = {
  async: {
    aml: file,
    csv: file,
    psv: file,
    tsv: file,
    txt: file,
    json: file,
    dbf
  },
  sync: {
    aml: fileSync,
    csv: fileSync,
    psv: fileSync,
    tsv: fileSync,
    txt: fileSync,
    json: fileSync
  }
}

formatsList.forEach(format => {
  format.equivalents.forEach(equivalent => {
    Object.keys(loaders).forEach(key => {
      loaders[key][equivalent] = loaders[key][format.name]
    })
  })
})

export default loaders
