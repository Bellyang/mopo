import fg from 'fast-glob'
import { unlinkSync } from 'node:fs'
import { copy } from 'esbuild-plugin-copy'

import type { Options } from 'tsup'

const CLI = 'packages/cli'
const SETTINGS = 'packages/settings'
const BOILERPLATE = 'packages/boilerplate'

const isCli = (name: string) => name === CLI
const isSetting = (name: string) => name === SETTINGS
const isBoilerplate = (name: string) => name === BOILERPLATE

export const isSplitting = (name: string) => !isCli(name)
export const isBundle = (name: string) => true//!isSetting(name)
export const cjsInterop = (type: string) => type === 'cjs'
// If the root package.json contains dependencies that submodules do not exist, this should include the root package.json.
export const packagePaths = (name: string) => `${name}/package.json`

export const tsPath = (name: string, type: string, dtsOnly: boolean) => {
  if (!isCli(name) && dtsOnly) return `${name}/tsconfig.${type}.build.json`
  return `${name}/tsconfig.${type}.json`
}
export const outDir = (name: string, type: string) => `${name}/dist/${type}`

export const onSuccess = (name: string, type: string): () => Promise<void> => {
  return async () => {
    if (isBoilerplate(name)) {
      fg.globSync(`${name}/dist/${type}/templates/**/.gitkeep`, { dot: true })
      .map(file => unlinkSync(file))
    }
  }
}

export const nodeExternalsInclude = (name: string, type: string): string[] => {
  if (isCli(name) && type === 'cjs') return ['gitlog']
  return []
}
export const entryPoint = (name: string): string[] => {
  if (name === CLI) return [`${name}/bin/mopo.ts`]
  if (name === SETTINGS) return fg.globSync(`${SETTINGS}/**/*.ts`, { ignore: [`${SETTINGS}/node_modules/**`] })
  return [`${name}/index.ts`]
}

export const copyDir = (name: string): Options['esbuildPlugins'] | [] => {
  const HOOKS = `${SETTINGS}/hooks`
  const CONFIGS = `${SETTINGS}/configs`
  const assets = [
    { from: [`${CONFIGS}/**/*.json`], to: [`./configs`] },
    { from: [`${HOOKS}/**/*`], to: [`./hooks`] }
  ]
  const boilerplate = [
    { from: [`${BOILERPLATE}/templates/**/*`], to: [`./templates`] },
  ]
  if (isSetting(name)) return assets.map(asset => copy({ assets: asset }))
  if (isBoilerplate(name)) {
    return [copy({
      assets: boilerplate,
      globbyOptions: { dot: true }
    })]
  }
  return []
}
