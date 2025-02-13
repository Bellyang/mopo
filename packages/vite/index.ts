import type { Package } from '@mopo/shared'

import type { UserConfig } from 'vite'
import configs from './configs'

export default async (
  { env, path, pkgName, repoRoot, analyzer }:
  { env: string, path: string, pkgName: string, repoRoot: string, analyzer: boolean },
  pkg: Package,
  isBuild: boolean = false,
) => {
  const { lib, configs: userConfig } = pkg
  const { build, createServer } = await import('vite')

  const defaultConfig = await configs({
    path,
    pkgName,
    repoRoot,
    analyzer,
    env: env || 'development',
  }, pkg)

  const config = await userConfig.configureBundler('vite', env, lib, defaultConfig) as UserConfig

  if (isBuild)
    return await build(config)

  const server = await createServer(config)
  await server.listen()

  server.printUrls()
  server.bindCLIShortcuts({ print: true })
}
