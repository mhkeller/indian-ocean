import babel from 'rollup-plugin-babel'
import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import sourcemaps from 'rollup-plugin-sourcemaps'

export default [
  {
    input: 'index.node.js',
    output: {
      format: 'es',
      file: 'dist/indian-ocean.es.js',
      sourcemap: true
    },
    plugins: [ nodeResolve(), commonjs(), babel(), sourcemaps() ],
    external: [
      'fs',
      'util',
      'shapefile',
      'archieml',
      'd3-dsv',
      'd3-queue',
      'dbf',
      'js-yaml',
      'mkdirp',
      'rimraf',
      'shapefile',
      'underscore'
    ]
  },
  {
    input: 'index.node.js',
    output: {
      format: 'cjs',
      file: 'dist/indian-ocean.cjs.js',
      sourcemap: true
    },
    plugins: [ nodeResolve(), commonjs(), babel(), sourcemaps() ],
    external: [
      'fs',
      'util',
      'path',
      'shapefile'
    ]
  }
]
