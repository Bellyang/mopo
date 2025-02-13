import type { Package } from '@mopo/shared'

import fse from 'fs-extra'

enum DependencyTypes {
  dependencies = 'dependencies',
  devDependencies = 'devDependencies',
  optionalDependencies = 'optionalDependencies',
  peerDependencies = 'peerDependencies',
}

interface DependenciesTypes {
  [DependencyTypes.dependencies]?: Record<string, any>
  [DependencyTypes.devDependencies]?: Record<string, any>
  [DependencyTypes.optionalDependencies]?: Record<string, any>
  [DependencyTypes.peerDependencies]?: Record<string, any>
}

const dependencyTypes: Array<DependencyTypes> = [
  DependencyTypes.dependencies,
  DependencyTypes.devDependencies,
  DependencyTypes.optionalDependencies,
  DependencyTypes.peerDependencies,
]

function bumpDepencencyVersion(existingVersion: string, newVersion: string) {
  let prefix = ''
  let firstChar = ''
  let range = existingVersion
  let suffix = newVersion

  if (existingVersion.startsWith('workspace:')) {
    prefix = 'workspace:'
    range = existingVersion.slice(prefix.length)
    suffix = range.length > 1 ? newVersion : ''
  }

  if (['^', '~'].includes(range[0]))
    firstChar = range[0]

  if (range === '*')
    return `${prefix}*`

  return `${prefix}${firstChar}${suffix}`
}

function bumpDependencies(deps: Record<string, any>, dependencies: Record<string, any>, packages: Package[]) {
  packages.forEach((pkg) => {
    const name = pkg.name
    const newVersion = pkg.version || ''
    const oldVersion = dependencies[name]
    if (oldVersion && oldVersion !== '') {
      deps[name] = bumpDepencencyVersion(oldVersion, newVersion)
    }
  })
}

async function bumpDependenciesByType(path: string, pkg: Package, packages: Package[]) {
  const dependenciesTypes: DependenciesTypes = {}
  dependencyTypes.forEach((type) => {
    const dependencies = pkg[type]
    if (typeof dependencies === 'object' && dependencies !== null && Object.keys(dependencies).length > 0) {
      dependenciesTypes[type] = {}
      bumpDependencies(dependenciesTypes[type], dependencies, packages)
    }
  })
  const types = Object.keys(dependenciesTypes) as DependencyTypes[]
  if (types.length !== 0) {
    const pkgJson = await fse.readJson(path)
    types.forEach(type => pkgJson[type] = { ...pkgJson[type], ...dependenciesTypes[type] })
    await fse.outputJSON(path, pkgJson, { spaces: 2 })
  }
}

export async function updateDependencies(packages: Package[]) {
  for (const pkg of packages) {
    const path = `${pkg.path}/package.json`
    await bumpDependenciesByType(path, pkg, packages)
  }
}
