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

/* --------------------------------------------
 * Join a path with a slash, removing any stub entries that end in a slash
 * to avoid a double slash scenario
 */
export function joinPath () {
  var args = Array.prototype.slice.call(arguments)
  return args.map((d, i) => {
    if (i === args.length - 1) return d
    return d.replace(/\/$/, '')
  }).join('/') // TODO, windows
}
