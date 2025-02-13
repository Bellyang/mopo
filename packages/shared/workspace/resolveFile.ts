import type { JSONObject, JSONValue } from '../types/Workspace'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { parse as parseYAML } from 'yaml'

export function isObject(value?: JSONValue): value is JSONObject {
  return !!value && typeof value === 'object' && !Array.isArray(value)
}

function isStringArray(value?: JSONValue): value is string[] {
  if (!Array.isArray(value))
    return false
  return value.every(item => typeof item === 'string')
}

function resolveYAMLFile(dir: string, file: string): JSONValue | undefined {
  const filePath = join(dir, file)
  try {
    return parseYAML(readFileSync(filePath).toString())
  }
  catch {
    return undefined
  }
}

export function resolveJSONFile(dir: string, file: string, cache: Map<string, JSONValue>): JSONValue | undefined {
  const filePath = join(dir, file)
  if (cache.has(filePath))
    return cache.get(filePath)
  try {
    const result = JSON.parse(readFileSync(filePath).toString())
    cache.set(filePath, result)
    return result
  }
  catch {
    cache.set(filePath, null)
    return null
  }
}

export function resolveLernaGlobs(dir: string, cache: Map<string, JSONValue>): string[] | null {
  const lernaJson = resolveJSONFile(dir, 'lerna.json', cache)
  if (lernaJson === undefined)
    return null

  if (
    isObject(lernaJson)
    && isStringArray(lernaJson.packages)
  ) {
    return lernaJson.packages
  }

  return null
}

export function resolvePnpmGlobs(dir: string): string[] | null {
  const pnpmWorkspaceYaml = resolveYAMLFile(dir, 'pnpm-workspace.yaml')
  if (pnpmWorkspaceYaml === undefined)
    return null

  if (
    isObject(pnpmWorkspaceYaml)
    && isStringArray(pnpmWorkspaceYaml.packages)
  ) {
    return pnpmWorkspaceYaml.packages
  }

  return ['**']
}

export function resolvePackageJsonGlobs(dir: string, cache: Map<string, JSONValue>): string[] | null {
  const packageJson = resolveJSONFile(dir, 'package.json', cache)
  if (packageJson === undefined)
    return null

  if (isObject(packageJson)) {
    if (isStringArray(packageJson.workspaces))
      return packageJson.workspaces

    if (
      isObject(packageJson.workspaces)
      && isStringArray(packageJson.workspaces.packages)
    ) {
      return packageJson.workspaces.packages
    }

    if (
      isObject(packageJson.bolt)
      && isStringArray(packageJson.bolt.workspaces)
    ) {
      return packageJson.bolt.workspaces
    }
  }

  return null
}

export function findGlobs(dir: string, fileCache: Map<string, JSONValue>): string[] | null {
  const lernaGlobs = resolveLernaGlobs(dir, fileCache)
  if (lernaGlobs)
    return lernaGlobs

  const pnpmGlobs = resolvePnpmGlobs(dir)
  if (pnpmGlobs)
    return pnpmGlobs

  return resolvePackageJsonGlobs(dir, fileCache)
}
