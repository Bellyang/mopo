import type { Config, Lib, TPlugin } from '@mopo/shared'
import { dirname, join, resolve } from 'node:path'

import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

function configPath(name: string) {
  // Since the ESLint configuration has a problem using .mjs files, all configuration files will use CommonJS format.
  const basePath = require.main ? './configs/' : '../cjs/configs'
  return resolve(__dirname, basePath, name)
}

const pluginConfigs = {
  czg: './czg.config.js',
  babel: './babel.config.js',
  postcss: './postcss.config.js',
  eslint: './eslint.config.js',
  typescript: './tsconfig.json',
  releaseIt: './release.config.js',
  prettier: './prettier.config.js',
  commitlint: './commitlint.config.js',
  lintStaged: './lint-staged.config.js',
  browserslist: './browserslist.config.js',
} as const

function queryConfigByLib(lib: Lib, key: keyof TPlugin, file: string): string {
  const libKeys = {
    vue3: ['babel', 'eslint', 'browserslist'],
    react: ['babel', 'eslint', 'browserslist', 'typescript'],
  }

  if (libKeys[lib as keyof typeof libKeys]?.includes(key))
    return configPath(join(lib, file))
  return configPath(file)
}

const defaultPlugins: (lib: Lib) => Promise<TPlugin> = async (lib: Lib) => Object.fromEntries(
  await Promise.all(
    (Object.entries(pluginConfigs) as [keyof TPlugin, string][]).map(async ([key, file]) => {
      const path = queryConfigByLib(lib, key, file)
      if (key === 'babel' || key === 'postcss' || key === 'lintStaged') {
        return [key, { configPath: path, config: await import(path).then(m => m.default) }]
      }
      return [key, { configPath: path, config: {} }]
    }),
  ),
)

const plugins: (lib: Lib) => Promise<Record<keyof TPlugin, {
  loader: (cwd: string, path: string | undefined) => Promise<Record<PropertyKey, never> | Config>
  plugin: Config
}>> = async (lib: Lib) => {
  return Object.fromEntries(
    await Promise.all(
      Object.entries(pluginConfigs).map(async ([key]) => [
        key as keyof TPlugin,
        {
          loader: await import(`./plugins/${key}.ts`).then(m => m.default),
          plugin: (await defaultPlugins(lib))[key as keyof TPlugin],
        },
      ]),
    ),
  )
}

export async function configLoader(name: keyof TPlugin, cwd: string, path: string | undefined, lib: Lib): Promise<Config> {
  const plugins = (await defaultPlugins(lib))[name]
  if (!path)
    return plugins
  const config = await import(`./plugins/${name}.ts`).then(m => m.default(cwd, path))
  return Object.keys(config).length === 0 ? plugins : config
}

export default async (cwd: string, lib: Lib, path?: string): Promise<TPlugin> => {
  const pluginsMap = await plugins(lib)
  if (!path) {
    return Object.fromEntries(
      Object.entries(pluginsMap).map(([key, { plugin }]) => [key, plugin]),
    ) as TPlugin
  }

  const results = await Promise.all(
    Object.entries(pluginsMap).map(async ([key, { loader, plugin }]) => {
      const loaded = await loader(cwd, path)
      return [key, Object.keys(loaded).length === 0 ? plugin : loaded]
    }),
  )

  return Object.fromEntries(results) as TPlugin
}
