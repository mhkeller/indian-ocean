import babel from 'rollup-plugin-babel'
import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

export default {
  entry: 'index.node.js',
  format: 'cjs',
  plugins: [ nodeResolve(), commonjs(), babel() ],
  dest: 'dist/indian-ocean.node.js',
  external: ['fs', 'path', 'util']
}
