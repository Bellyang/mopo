import type { Package, TConfig } from '@mopo/shared'
import { configPath, tsConfGenerator } from '@mopo/settings'

import { dict } from '@mopo/shared'

import checker from 'vite-plugin-checker'

import { req } from '../utils'

export default async ({ path, lib }: { path: string, lib: Package['lib'] }, configs: TConfig['configs']) => {
  const { typescript, eslint } = configs
  const tsConfig = await tsConfGenerator.generateTSConfig(path, typescript.configPath)

  const vueTsc = lib === 'react' ? { vueTsc: false } : { vueTsc: { root: tsConfig } }

  return [
    checker({
      enableBuild: false,
      typescript: {
        root: tsConfig,
      },
      ...vueTsc,
      eslint: {
        dev: {
          overrideConfig: { overrideConfig: req(eslint.configPath) },
        },
        lintCommand: `${eslint.binPath} "${dict.target(`${path}/**/*.{js,ts,vue}`)}" --resolve-plugins-relative-to "${configPath.settings('./node_modules/')}"`,
      },
    }),
  ]
}
