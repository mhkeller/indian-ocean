import yamlParser from 'js-yaml'
// import formattingPreflight from '../utils/formattingPreflight'
// import parseError from '../reporters/parseError'

export default function (file, writeOptions) {
  writeOptions = writeOptions || {}
  var writeMethod = writeOptions.writeMethod || 'safeDump'
  delete writeOptions.writeMethod
  return yamlParser[writeMethod](file, writeOptions)
}
