import { dep } from '../utils/resolver'

export default {
  'extends': [
    dep('stylelint-config-standard-scss'),
    dep('stylelint-config-recommended-vue/scss'),
  ],
  'custom-syntax': dep('postcss-html'),
  'rules': {
    // 命名规范，使用横杆
    'selector-class-pattern': [
      '^([a-z][a-z0-9]*)(-[a-z0-9]+)*$',
      {
        message: 'Expected class selector to be kebab-case',
      },
    ],
    'max-nesting-depth': 3,
    'no-empty-source': true,
    'no-empty-first-line': true,
    'rule-empty-line-before': 'never',
    'color-no-invalid-hex': true,
    'string-no-newline': true,
    'unit-no-unknown': true,
    'property-no-unknown': true,
    'comment-no-empty': true,
    'block-no-empty': true,
    'string-quotes': 'single',
    'function-comma-space-after': 'always',
    'unit-case': 'lower',
    'value-keyword-case': 'lower',
    'declaration-colon-space-after': 'always',
    'block-closing-brace-newline-after': 'always',
    'declaration-colon-space-before': 'never',
    'block-closing-brace-empty-line-before': 'never',
    'block-opening-brace-space-before': 'always',
    'indentation': [2, { // 指定缩进  warning 提醒
      severity: 'warning',
    }],
    'selector-pseudo-element-no-unknown': [
      true,
      {
        ignorePseudoElements: ['v-deep'],
      },
    ],

    'no-descending-specificity': null,
    'scss/at-import-partial-extension': null,
    'font-family-no-missing-generic-family-keyword': null,
    'scss/dollar-variable-pattern': null,
    'scss/at-extend-no-missing-placeholder': null,
    'declaration-block-no-redundant-longhand-properties': null,
    'declaration-block-no-shorthand-property-overrides': null,
    'scss/operator-no-unspaced': null,
    'font-family-name-quotes': null,
    'no-duplicate-selectors': null,
    'declaration-block-no-duplicate-properties': null,
    'function-url-quotes': null,
    'scss/double-slash-comment-whitespace-inside': null,
    'scss/at-mixin-pattern': null,
    'scss/at-import-no-partial-leading-underscore': null,
  },
}
