import yamlParser from 'js-yaml'
import omit from '../utils/omit'
// import formattingPreflight from '../utils/formattingPreflight'
// import parseError from '../reporters/parseError'

export default function (file, writeOptions) {
  writeOptions = writeOptions || {}
  var writeMethod = writeOptions.writeMethod || 'safeDump'
  return yamlParser[writeMethod](file, omit(writeOptions, ['writeMethod']))
}
