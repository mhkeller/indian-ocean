import parseJson from 'parse-json'
import mapValues from 'lodash/mapValues'
import identity from '../utils/identity'
import map from 'lodash/map'

export default function (str, parserOptions) {
  parserOptions = parserOptions || {}
    // Do a naive test whether this is a string or an object
  var mapFn = parserOptions.map ? str.trim().charAt(0) === '[' ? map : mapValues : identity
  var jsonParser = parserOptions.nativeParser === true ? JSON.parse : parseJson
  return mapFn(jsonParser(str, parserOptions.reviver, parserOptions.filename), parserOptions.map)
}
