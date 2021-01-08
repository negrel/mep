import typescript from '@rollup/plugin-typescript'
import eslint from '@rbnlffl/rollup-plugin-eslint'

const watch = {
  include: 'src'
}

export default {
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
}
