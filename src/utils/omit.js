// Return a copy of the object, filtered to omit the blacklisted array of keys.
export default function omit (obj, blackList) {
  var newObj = {}
  Object.keys(obj || {}).forEach(key => {
    if (blackList.indexOf(key) === -1) {
      newObj[key] = obj[key]
    }
  })
  return newObj
}
