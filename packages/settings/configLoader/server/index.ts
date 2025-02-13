import type { DevConfig, NormalizedServer } from '@mopo/shared'

import ip from 'ip'

const defaultHost = ip.address()

const defaultHmr = {
  port: 8080,
  host: defaultHost,
  protocol: 'auto',
  overlay: false,
  path: 'ws',
  timeout: 5000,
}

const defaultServer: NormalizedServer = {
  port: 8080,
  strictPort: false,
  https: false,
  open: false,
  host: '0.0.0.0',
  proxy: undefined,
  headers: undefined,
  cors: false,
  warmup: undefined,
  fs: undefined,
  origin: undefined,
  sourcemapIgnoreList: undefined,
  middlewareMode: false,
  watch: undefined,
  hmr: defaultHmr,
} as const

export default (configs?: DevConfig): NormalizedServer => {
  if (!configs)
    return { ...defaultServer }
  const hmrConfig = (() => {
    if (configs.hmr === false)
      return false
    if (configs.hmr === true)
      return { ...defaultHmr }
    return {
      ...defaultHmr,
      ...configs.hmr,
    }
  })()
  return {
    ...defaultServer,
    ...configs,
    hmr: hmrConfig,
  }
}
