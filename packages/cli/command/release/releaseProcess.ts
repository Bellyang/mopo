import type { TConfig } from '@mopo/shared'

import type Execa from 'execa'
import { command } from './commander'

export interface Options {
  names: string[]
  branch: string
  ci: boolean | undefined
  diff: boolean | undefined
  dryRun: boolean | undefined
  verbose: boolean | undefined
  sameVersion: boolean | undefined
}

function extendOptions(opts: string[], extra: Options) {
  const { ci, dryRun, verbose } = extra
  if (ci)
    opts.push('--ci')
  if (verbose)
    opts.push('-VV')
  if (dryRun)
    opts.push('--dry-run')
  return opts
}

function extendOpts(name: string, baseOpts: Execa.Options) {
  return {
    env: {
      ...process.env,
      npm_package_name: name,
    },
    ...baseOpts,
  }
}

export async function releaseSameVer(path: string, releaseIt: TConfig['configs']['releaseIt'], baseOptions: Options) {
  const { configPath } = releaseIt
  const options = extendOptions([configPath], baseOptions)
  const opts = extendOpts('overall', {})
  await command(path, releaseIt, options, opts)
}

export async function releasePkg(path: string, name: string, releaseIt: TConfig['configs']['releaseIt'], baseOptions: Options) {
  // TODO: submit a issue here to @release-it/conventional-changelog
  // when use "--no-plugins.@release-it/conventional-changelog" will throw a error:
  //  Cannot create property 'tagPrefix' on boolean 'false'
  const { configPath } = releaseIt
  const options = extendOptions([
    configPath,
    '--no-increment',
    '--no-git.changelog',
    '--no-git.requireCleanWorkingDir',
    '--no-plugins',
  ], baseOptions)
  const opts = extendOpts(name, {})
  await command(path, releaseIt, options, opts)
}

export async function bumpVersion(flag: boolean, releaseIt: TConfig['configs']['releaseIt'], path: string, name: string, baseOptions: Options) {
  const options = extendOptions([
    releaseIt.configPath,
    '--no-github',
    '--no-gitlab',
    '--no-git.tag',
    '--no-git.commit',
    '--no-git.push',
    '--no-npm.publish',
    '--npm.skipChecks',
    '--no-plugins.@release-it-plugins/workspaces',
  ], baseOptions)
  const opts = extendOpts(name, {
    *stdout(chunk: unknown) {
      if (typeof chunk === 'string' && !chunk.includes('Done'))
        yield chunk
    },
  })
  await command(path, releaseIt, flag ? options : [...options, '--no-git.requireCleanWorkingDir'], opts)
}
