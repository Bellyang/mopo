import { dep } from '../utils/resolver'

export default {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  ignorePatterns: [
    'node_modules',
    'dist',
    '*.d.ts',
  ],
  extends: [
    'eslint:recommended',
    'plugin:vue/essential',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: dep('vue-eslint-parser'),
  parserOptions: {
    ecmaVersion: 12,
    parser: dep('@typescript-eslint/parser'),
    sourceType: 'module',
    warnOnUnsupportedTypeScriptVersion: false,
  },
  plugins: [
    'eslint-plugin-vue',
    '@typescript-eslint',
  ],
  processor: 'vue/.vue',
  rules: {
    quotes: [2, 'single', { allowTemplateLiterals: true }],
    semi: [2, 'never', { beforeStatementContinuationChars: 'always' }],
  },
}
