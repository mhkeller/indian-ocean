import extend from './extend'
/**
 * A more semantic convenience function. Delegates to {@link helpers#extend} and passes `true` as the first argument. Recursively merge the contents of two or more objects together into the first object.
 *
 * @function deepExtend
 * @param {Object} destination The object to modify
 * @param {Object} source The object whose contents to take
 * @param {Object} [source2] Optional, You can add any number of objects as arguments.
 * @returns {Object} result The merged object. Note that the `destination` object will always be modified.
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
 * io.deepExtend(object1, object2)
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
export default function deepExtend () {
  var args = Array.prototype.slice.call(arguments) // Make real array from arguments
  args.unshift(true) // Add `true` as first arg.
  extend.apply(this, args)
}
