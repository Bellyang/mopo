import type { MopoConfig } from '@mopo/shared'

export { default as configLoader, generateConfig } from './configLoader'
export * as configPath from './utils/configPath'
export * as resolver from './utils/resolver'
export * as tsConfGenerator from './utils/tsConfGenerator'

export function defineConfig(config: MopoConfig): MopoConfig {
  return config
}
