/* --------------------------------------------
 * Browser-implementations of NodeJS path module, adapted from Rich Harris, https://github.com/rollup/rollup/blob/master/browser/path.js
 */

const splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^/]+?|)(\.[^./]*|))(?:[/]*)$/

function posixSplitPath (filename) {
  const out = splitPathRe.exec(filename)
  out.shift()
  return out
}

export function extname (filename) {
  return posixSplitPath(filename)[3]
}

export function dirname (path) {
  const match = /(\/|\\)[^/\\]*$/.exec(path)
  if (!match) return '.'

  const dir = path.slice(0, -match[0].length)

  // If `dir` is the empty string, we're at root.
  return dir || '/'
}

export function joinPath () {
  var args = Array.prototype.slice.call(arguments)
  return args.join('/') // TODO, windows
}
