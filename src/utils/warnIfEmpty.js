import _ from 'underscore'
import warn from '../reporters/warn'

export default function warnIfEmpty (data, outPath, opts_) {
  if (!opts_ || (opts_ && opts_.verbose !== false)) {
    if (!data || _.isEmpty(data)) {
      let msg = 'You didn\'t pass any data to write for file: `' + outPath + '`. Writing out an empty '
      if (!data) {
        msg += 'file'
      } else if (_.isEmpty(data)) {
        msg += Array.isArray(data) === true ? 'array' : 'object'
      }
      msg += '...'
      warn(msg)
    }
  }
}
