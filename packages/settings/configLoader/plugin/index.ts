import type { Lib, TPlugin, TPluginProps } from '@mopo/shared'
import { dep, deps } from '../../utils/resolver'
import { binsLoader } from './bins'

import configs, { configLoader } from './configs'

const plugins = ['babel', 'czg', 'eslint', 'commitlint', 'lintStaged', 'prettier', 'releaseIt', 'typescript', 'postcss', 'browserslist']

const pluginMap: TPluginProps = Object.fromEntries(
  plugins.map(key => [key, { path: '', binPath: '', configPath: '', config: {} }]),
) as TPluginProps

function isValidPluginConfig(keys: string[], pluginName: string, config: { path?: string, configPath?: string }): boolean {
  return !keys.includes(pluginName)
    || (!config.path && !config.configPath)
    || (typeof config.configPath !== 'string' && typeof config.path !== 'string')
}

async function defaultPlugins(cwd: string, lib: Lib, path?: string) {
  const pluginConfigs = await configs(cwd, lib, path)
  const plugins = Object.keys(pluginMap) as Array<keyof TPlugin>

  const resolvePath = (name: string): string => {
    if (name === 'commitlint')
      return dep('@commitlint/cli')
    if (name === 'lintStaged')
      return dep('lint-staged')
    if (name === 'releaseIt')
      return dep('release-it')
    if (name === 'babel' || name === 'postcss' || name === 'browserslist')
      return ''
    return dep(name)
  }

  plugins.forEach((name) => {
    pluginMap[name] = {
      path: resolvePath(name),
      binPath: deps[name],
      configPath: pluginConfigs[name].configPath,
      config: pluginConfigs[name].config,
    }
  })
  return pluginMap
}

async function loadConfigs(cwd: string, pluginName: keyof TPlugin, pluginConfig: { path?: string, configPath?: string }, lib: Lib) {
  const path = typeof pluginConfig.path === 'string' ? pluginConfig.path : undefined
  const configPath = typeof pluginConfig.configPath === 'string' ? pluginConfig.configPath : undefined
  const config = await configLoader(pluginName, cwd, configPath, lib)
  const binPath = await binsLoader(cwd, pluginName, path)

  return {
    path: dep(pluginName),
    binPath,
    configPath: config.configPath,
    config: config.config,
  }
}

export default async (
  cwd: string,
  plugins: string | TPluginProps | TPlugin | undefined,
  lib: Lib,
): Promise<TPluginProps> => {
  if (!plugins || (typeof plugins === 'string' && !plugins)) {
    return await defaultPlugins(cwd, lib)
  }

  if (typeof plugins === 'string') {
    return await defaultPlugins(cwd, lib, plugins)
  }

  const pluginMap: TPluginProps = await defaultPlugins(cwd, lib)
  const keys = Object.keys(pluginMap)

  if (Object.keys(plugins).length === 0) {
    return pluginMap
  }

  for (const [pluginName, pluginConfig] of Object.entries(plugins)) {
    const typedPluginName = pluginName as keyof TPlugin
    if (isValidPluginConfig(keys, pluginName, pluginConfig))
      continue
    pluginMap[typedPluginName] = await loadConfigs(cwd, typedPluginName, pluginConfig, lib)
  }

  return pluginMap
}
