// TODO, break this out into its own browser repo to avoid the need for builtins and globals
import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';
import sourcemaps from 'rollup-plugin-sourcemaps';

export default {
	input: 'index.browser.js',
	plugins: [nodeResolve(), commonjs(), builtins(), globals(), babel(), sourcemaps()],
	output: [
		{
			format: 'umd',
			file: 'dist/indian-ocean.js',
			name: 'io',
			sourcemap: true
		}, {
			format: 'es',
			file: 'dist/indian-ocean.browser.es6.js',
			name: 'io',
			sourcemap: true
		}
	]
};
