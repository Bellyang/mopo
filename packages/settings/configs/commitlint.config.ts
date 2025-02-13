import { dep } from '../utils/resolver'
import config from './czg.config'

const commitTypes = 'build|chore|ci|docs|feat|fix|perf|refactor|revert|style|test'
const scopesPattern = config.scopes.map(scope =>
  scope.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
).join('|')
const regex = new RegExp(
  `^(${commitTypes})`
  + `(?:\\((${scopesPattern})`
  + `(?:,\\s*(${scopesPattern}))*\\))?`
  + `(!)?:`
  + `|^Merge |^Initial commit$`,
)

export default {
  prompt: config,
  parserPreset: {
    headerPattern: regex,
    headerCorrespondence: ['type', 'scope', 'subject'],
  },
  extends: [dep('@commitlint/config-conventional')],
  rules: {
    'type-enum': [2, 'always', config.types.map(i => i.value)],
    'scope-enum': [2, 'always', config.scopes.map(i => i)],
    'scope-empty': [2, 'never'],
    'body-empty': [0, 'always'],
  },
}
