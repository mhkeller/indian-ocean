import babel from 'rollup-plugin-babel'
import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import builtins from 'rollup-plugin-node-builtins'
import globals from 'rollup-plugin-node-globals'

export default {
  entry: 'index.browser.js',
  format: 'umd',
  moduleName: 'io',
  plugins: [ babel(), nodeResolve(), commonjs(), builtins(), globals() ],
  dest: 'dist/indian-ocean.js'
}
