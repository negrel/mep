import eslint from '@rollup/plugin-eslint'
import typescript from '@rollup/plugin-typescript'
import dts from 'rollup-plugin-dts'

const watch = {
  include: 'src'
}

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/bundle.cjs.js',
        format: 'cjs'
      },
      {
        file: 'dist/bundle.es.js',
        format: 'es'
      }
    ],
    watch,
    plugins: [eslint(), typescript()]
  },
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/mep.d.ts',
      format: 'es'
    },
    watch,
    plugins: [dts()]
  }
]
