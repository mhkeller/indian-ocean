import babel from 'rollup-plugin-babel'
import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

export default {
  input: 'index.node.js',
  output: {
    format: 'cjs'
  },
  plugins: [ nodeResolve(), commonjs(), babel() ],
  external: ['fs', 'path', 'util', 'shapefile']
}
