import type { OptionValues } from 'commander'

export interface CommandDescription {
  name: string
  args?: string
  prehooks?: string[]
  usage?: [string]
  command?: [string]
  argument?: string[]
  description?: string
  version?: [string, string]
  options?: [string, string, (string | boolean | string[])?][]
  cb?: (...args: any[]) => void
}

export interface Options {
  names: string[]
  speed: boolean
  analyzer: boolean
  branch: string
  env: string
  bundler: string
  diff: boolean
  all: boolean
  prompt: boolean
}

export interface CommandArgument {
  args: string[]
  command?: [string]
  options?: OptionValues
}
