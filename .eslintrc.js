module.exports = {
  env: {
    commonjs: true,
    es6: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'standard'
  ],
  parserOptions: {
    ecmaVersion: 2019
  },
  overrides: [
    {
      files: ['*.tsx', '*.ts'],
      extends: ['plugin:@typescript-eslint/recommended', 'standard-with-typescript'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: './tsconfig.json'
      }
    }
  ]
}
