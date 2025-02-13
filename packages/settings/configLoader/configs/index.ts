import type { Configuration, Lib, MopoConfig, NormalizedConfig, UserConfig } from '@mopo/shared'

const defaultConfig: NormalizedConfig = {
  outputDir: 'root',
  publicPath: '/',
  integrity: false,
  crossorigin: '',
  productionSourceMap: false,
  transpileDependencies: false,
  configureBundler: async (_bundler: 'vite' | 'webpack', _env: string, _library: Lib, config: Configuration | UserConfig) => config,
}

export default (configs?: MopoConfig): NormalizedConfig => {
  if (!configs)
    return defaultConfig

  const validators = {
    outputDir: (value: unknown): value is 'root' | 'package' =>
      typeof value === 'string' && ['root', 'package'].includes(value),
    publicPath: (value: unknown): value is string =>
      typeof value === 'string',
    integrity: (value: unknown): value is boolean =>
      typeof value === 'boolean',
    crossorigin: (value: unknown): value is '' | 'anonymous' | 'use-credentials' =>
      typeof value === 'string' && ['', 'anonymous', 'use-credentials'].includes(value),
    productionSourceMap: (value: unknown): value is boolean =>
      typeof value === 'boolean',
    transpileDependencies: (value: unknown): value is boolean =>
      typeof value === 'boolean',
    configureBundler: (value: unknown): value is NormalizedConfig['configureBundler'] =>
      typeof value === 'function',
  }

  Object.entries(configs).forEach(([key, value]) => {
    if (value !== undefined
      && key in validators
      && validators[key as keyof typeof validators](value)) {
      (defaultConfig[key as keyof NormalizedConfig] as any) = value
    }
  })

  return defaultConfig
}
