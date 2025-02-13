import type { PackageJson as PackageJsonType } from 'pkg-types'
import type { TConfig } from './Configuration'
import type { Lib } from './Libs'

export interface Options {
  stopDir?: string
  cache?: Cache
}

export interface Cache {
  root: Map<string, WorkspacesRoot | null>
  workspaces: Map<string, RawPackage[]>
  clear: () => void
}

export type PackageJson = PackageJsonType

export type JSONValue =
  | string
  | number
  | boolean
  | null
  | Array<JSONValue>
  | JSONObject

export interface JSONObject { [key: string]: JSONValue | undefined }

export type NpmClient = 'npm' | 'yarn' | 'pnpm'
export interface WorkspacesRoot { path: string, globs: string[] }

export interface RawPackage {
  path: string
  package: PackageJsonType & { name: string }
}

export interface Workspace {
  isRoot: boolean
  globs: string[]
  rootPath: string
  packages: Package[]
  rootConfig: TConfig
}

export interface Package extends PackageJson {
  name: string
  root: string
  path: string
  relativePath: string
  lib: NonNullable<Lib>
  configs: TConfig
}
