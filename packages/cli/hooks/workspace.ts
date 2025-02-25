import type { Package, RawPackage, Workspace, WorkspacesRoot } from '@mopo/shared'

import { basename, join, relative, resolve } from 'node:path'
import { generateConfig } from '@mopo/settings'
import { dict, logger, pathOperator, workspace as workspaces } from '@mopo/shared'
import { exec } from '../utils/commadExecutor'
import { diff } from '../utils/git'

import { queryLib } from '../utils/libCheck'
import { checkbox } from '../utils/prompts'

type BasePackage = Omit<Package, 'configs' | 'lib'>

function isCurrentDirectoryAvailable(root: string, packages: RawPackage[]) {
  const isRoot = pathOperator.pathsEqual(dict.cwd, root)
  const isPackage = packages.some((pkg) => pathOperator.pathsEqual(pkg.path, dict.cwd))
  if (!isRoot && !isPackage) throw new Error(logger.NOT_AVAILABLE_PATH)
  return { isRoot, rootPath: root }
}

async function diffPackages(packages: BasePackage[], root: string): Promise<BasePackage[]> {
  const prefix = ((await exec('git', ['rev-parse', '--show-toplevel'])) as string) || root
  const files = await diff()

  if (files)
    return packages.filter((pkg) => files.some((file: string) => pathOperator.isSubdir(pkg.path, join(prefix, file))))
  return []
}

async function packagesFilter(
  root: string,
  packages: BasePackage[],
  options?: {
    names?: string[] | undefined
    prompt?: boolean
    diff?: boolean
    all?: boolean
    sameVersion?: boolean
  },
): Promise<BasePackage[]> {
  const { names, prompt, all, diff, sameVersion } = options || {}
  const isRoot = !packages.some((pkg) => pathOperator.pathsEqual(pkg.path, dict.cwd))
  // Only when not in the root directory, and in the package directory,
  // will it return only the packages in the current directory.
  if (!isRoot) {
    const currentPackage = packages.filter((pkg) => pathOperator.pathsEqual(pkg.path, dict.cwd))
    if (!currentPackage.length) throw new Error(logger.PACKAGE_MISSING)
    return currentPackage
  }

  if (all || sameVersion) return packages

  if (diff) {
    const diffedPackages = await diffPackages(packages, root)
    if (!diffedPackages.length) throw new Error(logger.PACKAGE_MISSING)
    return diffedPackages
  }

  if (prompt) {
    const diffedPackages = await diffPackages(packages, root)
    if (!diffedPackages.length) throw new Error(logger.PACKAGE_MISSING)
    const selected = (await checkbox(
      'Please select packages: ',
      diffedPackages.map((pkg) => ({ name: pkg.name, value: pkg })),
      true,
    )) as Package[]
    if (!selected?.length) throw new Error(logger.PACKAGE_MISSING)
    return selected
  }

  if (!Array.isArray(names)) throw new Error(logger.PACKAGE_MISSING)
  // Handle the situation when executed in package.json
  if (names.length === 0) {
    const currentPackage = packages.filter((pkg) => pathOperator.pathsEqual(pkg.path, dict.cwd))
    if (!currentPackage.length) throw new Error(logger.PACKAGE_MISSING)
    return currentPackage
  }

  const filteredPackages = packages.filter((pkg) =>
    names.some((name) => (name.includes('@') ? name === pkg.name : name === basename(pkg.path))),
  )

  if (!filteredPackages.length) throw new Error(logger.PACKAGE_MISSING)
  return filteredPackages
}

function mappedPackages(packages: RawPackage[], root: string): BasePackage[] {
  return packages.map((pkg) => ({
    ...pkg.package,
    root,
    name: pkg.package.name || '',
    path: resolve(pkg.path),
    relativePath: relative(dict.cwd, pkg.path) === '' ? './' : relative(dict.cwd, pkg.path),
  }))
}

export default async ({
  options,
}: {
  options?: {
    names?: string[] | undefined
    sameVersion?: boolean
    prompt?: boolean
    diff?: boolean
    all?: boolean
  }
}): Promise<Workspace> => {
  const { findWorkspaces, findWorkspacesRoot } = workspaces
  const packages: RawPackage[] | null = findWorkspaces()
  const workspace: WorkspacesRoot | null = findWorkspacesRoot()

  if (workspace === null || packages === null) throw new Error(logger.NOT_MONOREPO)
  if (!Array.isArray(packages)) throw new Error(logger.NOT_MONOREPO)
  if (packages.length === 0) throw new Error(logger.EMPTY_MONOREPO)

  const { isRoot, rootPath } = isCurrentDirectoryAvailable(workspace.path, packages)
  const npmClient = workspaces.getNpmClient(rootPath)
  if (!npmClient) throw new Error(logger.PACKAGE_MANAGER_NOT_FOUND)

  const pkgs = mappedPackages(packages, workspace.path)

  const filtedPackages = await packagesFilter(workspace.path, pkgs, options)

  const [rootLib, rootConfig] = await Promise.all([
    queryLib(npmClient, rootPath),
    // currently, the root config just uses the show bin path to execute commands, so which lib is not important
    generateConfig(rootPath, 'vue2'),
  ])

  const enhancedPackages = await Promise.all(
    filtedPackages.map(async (pkg) => {
      const lib = await queryLib(npmClient, pkg.path)
      const finalLib = lib || rootLib || 'vue2'
      const configs = await generateConfig(pkg.path, finalLib)

      return {
        ...pkg,
        configs,
        lib: lib || rootLib || 'vue2',
      } as Package
    }),
  )

  return {
    isRoot,
    rootPath,
    globs: workspace.globs,
    packages: enhancedPackages,
    rootConfig,
  }
}
