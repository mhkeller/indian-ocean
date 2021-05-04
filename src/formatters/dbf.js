/* istanbul ignore next */
import dbf from '@mhkeller/dbf'

export default function (file, writeOptions) {
  writeOptions = writeOptions || {}
  function toBuffer (ab) {
    var buffer = new Buffer(ab.byteLength)
    var view = new Uint8Array(ab)
    for (var i = 0; i < buffer.length; ++i) {
      buffer[i] = view[i]
    }
    return buffer
  }
  var buf = dbf.structure(file)
  return toBuffer(buf.buffer)
}
