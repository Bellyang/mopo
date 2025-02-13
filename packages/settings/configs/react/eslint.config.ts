import { dep } from '../../utils/resolver'

export default {
  env: {
    browser: true,
    es2020: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:@typescript-eslint/recommended',
  ],
  ignorePatterns: [
    '**/*.html',
    'node_modules',
    'dist',
    '*.d.ts',
  ],
  parser: dep('@typescript-eslint/parser'),
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    parser: dep('@typescript-eslint/parser'),
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    'react',
    '@typescript-eslint',
  ],
  settings: {
    react: { version: 'detect' },
  },
  rules: {
    'react/prop-types': 0,
    'react/forbid-prop-types': 0,
    'react/jsx-indent': 0,
    'quotes': [2, 'single', { allowTemplateLiterals: true }],
    'semi': [2, 'never', { beforeStatementContinuationChars: 'always' }],
  },
}
