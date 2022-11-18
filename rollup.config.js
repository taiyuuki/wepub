import ts from 'rollup-plugin-typescript2'
import commonjs from '@rollup/plugin-commonjs'
import babelPlugin from '@rollup/plugin-babel'
import resolve from '@rollup/plugin-node-resolve'
import globals from 'rollup-plugin-node-globals'
import builtins from 'rollup-plugin-node-builtins'
import { terser } from 'rollup-plugin-terser'
import dts from 'rollup-plugin-dts'

const config = [
  {
    input: ['src/index.ts', 'src/browser.ts'],
    output: [
      {
        dir: 'dist/esm',
        format: 'esm',
        exports: 'default',
      },
      {
        dir: 'dist/cjs',
        format: 'cjs',
        exports: 'default',
      },
    ],
    plugins: [
      ts(),
      babelPlugin({ exclude: '**/node_modules/**' }),
      commonjs(),
      terser(),
    ],
  },
  {
    input: 'src/browser.ts',
    output: [
      {
        file: 'dist/umd/index.js',
        format: 'umd',
        name: 'Wepub',
        exports: 'default',
      },
    ],
    plugins: [
      ts(),
      babelPlugin({ exclude: '**/node_modules/**' }),
      commonjs(),
      resolve({ preferBuiltins: true, mainFields: ['browser'] }),
      globals(),
      builtins(),
      terser(),
    ],
  },
  {
    input: 'src/dts/index.d.ts',
    output: {
      file: 'dist/dts/index.d.ts',
      format: 'esm',
    },
    plugins: [dts()],
  },
]

export default config