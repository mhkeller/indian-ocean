/**
 * A port of jQuery's extend. Merge the contents of two or more objects together into the first object. Supports deep extending with `true` as the first argument.
 *
 * @param {Boolean} [deepExtend] Optional, set to `true` to merge recursively.
 * @param {Object} destination The object to modify
 * @param {Object} source The object whose contents to take
 * @param {Object} [source2] Optional, You can add any number of objects as arguments.
 * @returns {Object} result The merged object. Note that the `destination` object will always be modified.
 *
 * @example
 * var mergedObj = io.extend({}, {name: 'indian-ocean'}, {alias: 'io'})
 * console.log(mergedObj)
 * // {
 * //   name: 'indian-ocean',
 * //   alias: 'io'
 * // }
 *
 * var name = {name: 'indian-ocean'}
 * io.extend(name, {alias: 'io'})
 * console.log(name)
 * // {
 * //   name: 'indian-ocean',
 * //   alias: 'io'
 * // }
 *
 * @example
 * var object1 = {
 *   apple: 0,
 *   banana: { weight: 52, price: 100 },
 *   cherry: 97
 * }
 * var object2 = {
 *   banana: { price: 200 },
 *   almond: 100
 * }
 * io.extend(true, object1, object2)
 * console.log(object1)
 * //  {
 * //   apple: 0,
 * //   banana: {
 * //     weight: 52,
 * //     price: 200
 * //   },
 * //   cherry: 97,
 * //   almond: 100
 * // }
 *
 */
export default function extend () {
  var options
  var name
  var src
  var copy
  var copyIsArray
  var clone
  var target = arguments[0] || {}
  var i = 1
  var length = arguments.length
  var deep = false

  // Handle a deep copy situation
  if (typeof target === 'boolean') {
    deep = target

    // Skip the boolean and the target
    target = arguments[i] || {}
    i++
  }

  // Handle case when target is a string or something (possible in deep copy)
  if (typeof target !== 'object' && typeof target !== 'function') {
    target = {}
  }

  // Extend indian-ocean itself if only one argument is passed
  if (i === length) {
    target = this
    i--
  }

  for (; i < length; i++) {
    // Only deal with non-null/undefined values
    if ((options = arguments[i]) != null) {
      // Extend the base object
      for (name in options) {
        src = target[name]
        copy = options[name]

        // Prevent never-ending loop
        if (target === copy) {
          continue
        }

        // Recurse if we're merging plain objects or arrays
        if (deep && copy && (typeof copy === 'object') ||
            (copyIsArray = Array.isArray(copy))) {
          if (copyIsArray) {
            copyIsArray = false
            clone = src && Array.isArray(src) ? src : []
          } else {
            clone = src && typeof src === 'object' ? src : {}
          }

          // Never move original objects, clone them
          target[name] = extend(deep, clone, copy)

          // Don't bring in undefined values
        } else if (copy !== undefined) {
          target[name] = copy
        }
      }
    }
  }

  // Return the modified object
  return target
}
