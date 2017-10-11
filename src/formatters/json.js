export default function (file, writeOptions) {
  writeOptions = writeOptions || {}
  return JSON.stringify(file, writeOptions.replacer, writeOptions.indent)
}
