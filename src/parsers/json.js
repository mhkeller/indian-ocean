import identity from '../utils/identity'
import _ from 'underscore'

export default function (str, parserOptions) {
  parserOptions = parserOptions || {}
    // Do a naive test whether this is a string or an object
  var mapFn = parserOptions.map ? str.trim().charAt(0) === '[' ? _.map : _.mapObject : identity
  var jsonParser = parserOptions.nativeParser === true ? JSON.parse : JSON.parse
  // var jsonParser = parserOptions.nativeParser === true ? JSON.parse : parseJson
  return mapFn(jsonParser(str, parserOptions.reviver, parserOptions.filename), parserOptions.map)
}
