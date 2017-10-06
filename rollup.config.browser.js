// TODO, break this out into its own browser repo to avoid the need for builtins and globals
import babel from 'rollup-plugin-babel'
import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import builtins from 'rollup-plugin-node-builtins'
import globals from 'rollup-plugin-node-globals'

export default {
  entry: 'index.browser.js',
  moduleName: 'io',
  plugins: [nodeResolve(), commonjs(), builtins(), globals(), babel()],
  targets: [
    {
      format: 'umd',
      dest: 'dist/indian-ocean.js'
    }, {
      format: 'es',
      dest: 'dist/indian-ocean.browser.es6.js'
    }
  ]
}
