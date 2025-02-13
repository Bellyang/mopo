import type { UserConfig } from 'vite'
import type { Configuration } from 'webpack'

export * as browser from './const/browser'
export * as logger from './const/log'
export * as dict from './const/path'
export type {
  Config,
  Css,
  DevConfig,
  MopoConfig,
  NormalizedConfig,
  NormalizedCss,
  NormalizedPages,
  NormalizedServer,
  PageConfig,
  Pages,
  TConfig,
  TPlugin,
  TPluginProps,
} from './types/Configuration'
export type { Lib } from './types/Libs'
export type { NpmClient, Package, PackageJson, RawPackage, Workspace, WorkspacesRoot } from './types/Workspace'
export * as errorMessageCatch from './utils/errorMessageCatch'
export * as pathOperator from './utils/pathOperator'
export * as spinner from './utils/spinner'
export * as workspace from './workspace'

export type { UserConfig }
export type { Configuration }
