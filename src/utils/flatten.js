/* --------------------------------------------
 *
 * Underscore's _.flatten
 *
 * --------------------------------------------
 */
export default function flatten (input, output) {
  output = output || []
  var idx = output.length
  var ll = input.length
  for (var i = 0; i < ll; i++) {
    var value = input[i]
    if (Array.isArray(value)) {
      flatten(value, output)
      idx = output.length
    } else {
      output[idx++] = value
    }
  }
  return output
}
