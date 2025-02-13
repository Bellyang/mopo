import type { Package } from '@mopo/shared'
import type { Options } from '../types'

export async function executeBundler(repoRoot: string, options: Options, pkg: Package, isBuild?: boolean) {
  const { speed, env, analyzer, bundler } = options
  const buildOpts = { mode: env, env, speed, analyzer, repoRoot, pkgName: pkg.name, path: pkg.relativePath }

  const bundlers = {
    vite: () => import('@mopo/vite'),
    webpack: () => import('@mopo/webpack'),
  }

  const selectedBundler = bundlers[bundler as keyof typeof bundlers]
  if (!selectedBundler)
    throw new Error(`Unsupported bundler: ${bundler}`)

  const server = (await selectedBundler()).default
  await server(buildOpts, pkg, isBuild)
}
