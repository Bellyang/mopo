import { type Options } from 'tsup'
import { execSync } from 'child_process'
import { join, relative } from 'node:path'
import { nodeExternals } from 'esbuild-plugin-node-externals'

import { tsPath, outDir, onSuccess, isSplitting, cjsInterop, isBundle, copyDir, entryPoint, packagePaths, nodeExternalsInclude } from './configs'

const types: ('esm' | 'cjs')[] = ['esm', 'cjs']

const base: Options = {
  shims: true,
  clean: true,
  // splitting: true,
  platform: 'node',
}

function isDtsOnly(dts: Options['dts']): boolean {
  if (typeof dts === 'boolean') return dts
  if (typeof dts === 'string') return true
  if (typeof dts === 'object') return true
  return false
}

function listPkgs(): string[] {
  const cmd = `pnpm m ls --json --depth=-1`
  const res = execSync(cmd, { encoding: 'utf-8' })
  try {
    const pkgs = JSON.parse(res)
    return pkgs
      .map((m: { path: string }) => relative(join(__dirname, '..'), m.path))
      .filter((path: string) => Boolean(path) && !path.includes('docs'))
      .map((path: string) => path.replace(/\\/g, '/'))
  } catch (e) {
    return []
  }
}

export default ({ watch, dts }: Options): Options[] => {
  const packages = listPkgs()

  return packages.flatMap((name) =>
    types.map((type) => ({
      ...base,
      watch,
      format: type,
      bundle: isBundle(name),
      splitting: isSplitting(name),
      outDir: outDir(name, type),
      cjsInterop: cjsInterop(type),
      onSuccess: onSuccess(name, type),
      tsconfig: tsPath(name, type, isDtsOnly(dts)),
      entryPoints: entryPoint(name),
      esbuildPlugins: [
        ...(copyDir(name) || []),
        nodeExternals({
          include: nodeExternalsInclude(name, type),
          packagePaths: packagePaths(name)
        })
      ]
    }))
  )
}