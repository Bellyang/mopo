import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export function configPath(name: string) {
  if (require.main)
    return resolve(__dirname, './configs/', name)
  // Since the ESLint configuration has a problem using .mjs files, all configuration files will use CommonJS format.
  return resolve(__dirname, '../cjs/configs', name)
}

export const settings = (name: string) => resolve(__dirname, name)

export const tsConf = configPath('./tsconfig.json')
export const czgConf = configPath('./czg.config.js')
export const eslintConf = configPath('./eslint.config.js')
export const releaseItConf = configPath('./release.config.js')
export const prettierConf = configPath('./prettier.config.js')
export const styleLintConf = configPath('./stylelint.config.js')
export const lintStagedConf = configPath('./lint-staged.config.js')
export const commitlintConf = configPath('./commitlint.config.js')
