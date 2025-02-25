import type { Package, TConfig } from '@mopo/shared'
import type { Plugin, ResolvedConfig } from 'vite'

import { spawn } from 'node:child_process'
import { configPath, resolver, tsConfGenerator } from '@mopo/settings'

import { dict } from '@mopo/shared'
import { npmRunPathEnv } from 'npm-run-path'

type BuildCheckBin = () => [string, ReadonlyArray<string>]
interface ServeAndBuildChecker {
  build: { buildBin: BuildCheckBin; buildFile?: string }
}

export interface BuildInCheckers {
  vueTsc: string
  eslint: string
}

export type BuildInCheckerNames = keyof BuildInCheckers

interface CheckerMeta<T extends BuildInCheckerNames> {
  name: T
  absFilePath: string
  build: ServeAndBuildChecker['build']
}
abstract class Checker<T extends BuildInCheckerNames> implements CheckerMeta<T> {
  public name: T
  public absFilePath: string
  public build: ServeAndBuildChecker['build']

  public constructor({ name, absFilePath, build }: CheckerMeta<T>) {
    this.name = name
    this.absFilePath = absFilePath
    this.build = build
  }
}

class EslintChecker extends Checker<'eslint'> {
  public constructor(path: string, eslint: TConfig['configs']['eslint']) {
    super({
      name: 'eslint',
      absFilePath: __filename,
      build: {
        buildBin: () => [
          eslint.binPath,
          [
            '-c',
            eslint.configPath,
            `"${dict.target(`"${path}/**/*.{js,ts,vue}"`)}"`,
            '--resolve-plugins-relative-to',
            configPath.settings('./node_modules/'),
          ],
        ],
      },
    })
  }
}

class VueTscChecker extends Checker<'vueTsc'> {
  public constructor(tsConfig: string) {
    super({
      name: 'vueTsc',
      absFilePath: __filename,
      build: {
        buildBin: () => [resolver.deps.vueTsc, ['--noEmit', '-p', tsConfig]],
      },
    })
  }
}

function spawnChecker(checker: ServeAndBuildChecker, process: NodeJS.Process) {
  return new Promise<number>((resolve) => {
    const buildBin = checker.build.buildBin()

    const proc = spawn(...buildBin, {
      shell: true,
      stdio: 'inherit',
      cwd: process.cwd(),
      env: npmRunPathEnv({ env: process.env, cwd: process.cwd(), execPath: process.execPath }),
    })

    proc.on('exit', (code) => {
      if (code !== null && code !== 0) {
        resolve(code)
      } else {
        resolve(0)
      }
    })
  })
}

async function checker(
  { path, lib }: { path: string; lib: Package['lib'] },
  configs: TConfig['configs'],
): Promise<Plugin> {
  const { typescript, eslint } = configs
  const tsConfig = await tsConfGenerator.generateTSConfig(path, typescript.configPath)
  let initialized = false
  let initializeCounter = 0
  let isProduction = false
  let buildWatch = false
  const checkers: ServeAndBuildChecker[] =
    lib === 'react' ? [new EslintChecker(path, eslint)] : [new VueTscChecker(tsConfig), new EslintChecker(path, eslint)]
  const process = await import('node:process')

  return {
    apply: 'build',
    enforce: 'pre',
    // @ts-expect-error vite might deprecate this tag
    __internal__checker: Checker,
    name: 'vite-plugin-build-checker',
    config: async () => {
      if (initializeCounter === 0) {
        initializeCounter++
      } else {
        initialized = true
      }
    },
    configResolved(config: ResolvedConfig) {
      isProduction ||= config.isProduction || config.command === 'build'
      buildWatch = !!config.build.watch
    },
    buildStart: async () => {
      if (initialized || !isProduction) return

      const exitCodes = await Promise.all(checkers.map((checker) => spawnChecker(checker, process)))
      const exitCode = exitCodes.find((code) => code !== 0) ?? 0
      // do not exit the process if run `vite build --watch`
      if (exitCode !== 0 && !buildWatch) {
        process.exit(exitCode)
      }
    },
  }
}

export default async ({ path, lib }: { path: string; lib: Package['lib'] }, configs: TConfig['configs']) => [
  await checker({ path, lib }, configs),
]
