import antfu from '@antfu/eslint-config'

export default antfu(
  {
    ignores: [
      '!./docs/.vitepress',
      '**/node_modules/**',
      '**/lib/**',
      '**/dist/**',
      '**/examples/**',
      '**/cache/**',
    ],
    yaml: false,
    markdown: false,
  },
  {
    rules: {
      'no-console': 'off',
      'node/prefer-global/process': 'off',
      'unused-imports/no-unused-vars': ['error', {
        args: 'all',
        argsIgnorePattern: '^_',
        caughtErrors: 'all',
        caughtErrorsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        ignoreRestSiblings: true,
      }],
    },
  },
)
