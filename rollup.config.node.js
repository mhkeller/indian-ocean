import babel from 'rollup-plugin-babel'
import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import sourcemaps from 'rollup-plugin-sourcemaps'

export default {
  input: 'index.node.js',
  output: {
    format: 'cjs',
    file: 'dist/indian-ocean.cjs.js',
    sourcemap: true
  },
  plugins: [ nodeResolve(), commonjs(), babel(), sourcemaps() ],
  external: ['fs', 'path', 'util', 'shapefile']
}
