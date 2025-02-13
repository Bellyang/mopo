import type { Package, Workspace } from '@mopo/shared'
import type { CommandArgument } from '../types'
import { join, relative } from 'node:path'
import { confirm } from '@inquirer/prompts'

import { dict, logger, pathOperator } from '@mopo/shared'
import chalk from 'chalk'
import gitlog from 'gitlog'
import { exec } from '../utils/commadExecutor'

import { diff, gitAddAll, gitAddFiles, gitPush, isWorkingDirClean } from '../utils/git'
import { checkbox } from '../utils/prompts'

async function gitAdd(packages: Package[], filter: string[] = [], isRoot: boolean, rootPath: string, message: string) {
  const files = await diff({ filter, type: '--name-status' })
  if (!files?.length)
    return
  const filteredFiles = files.filter((file: string) => {
    const filePath = file.split(/(\s+)/).pop()?.trim() || ''
    return filter.length === 0 ? filePath : packages.some(pkg => pathOperator.isSubdir(pkg.path, join(rootPath, filePath)))
  }) || []
  if (!filteredFiles.length)
    return
  const choices = filteredFiles.map((file: string) => ({ name: file, value: file.split(/(\s+)/).pop()?.trim(), checked: true }))
  const checked = await checkbox(message, choices) as string[] || []
  const addFiles = checked.map(check => isRoot ? check : relative(dict.cwd, join(rootPath, check)))
  await gitAddFiles(addFiles)
}

function parseGlob(packages: Package[], configs: Record<string, any>) {
  const conf: Record<string, any> = {}
  Object.keys(configs).forEach(config =>
    packages.forEach(pkg =>
      conf[join(pkg.relativePath, config).replaceAll('\\', '/')] = configs[config],
    ),
  )
  return conf
}

export default async (
  { options }: CommandArgument,
  { packages, isRoot, rootPath, rootConfig }: Workspace,
) => {
  const { all } = options || {}
  const { czg, lintStaged } = rootConfig.configs
  const filter = all ? [] : packages?.map(pkg => pkg.relativePath)

  if (await isWorkingDirClean())
    throw new Error(logger.CLEAN_WORKSPACE)
  // avoid untracked files from being added
  await gitAddAll()

  await gitAdd(packages, filter, isRoot, rootPath, logger.CHOOSE_STAGED)

  const config = parseGlob(packages, lintStaged.config)
  await exec('npx', [lintStaged.binPath, '-c', '-'], { cwd: rootPath }, true, true, JSON.stringify(config))

  await gitAdd(packages, filter, isRoot, rootPath, logger.UNSTAGED)

  const czgConf = relative(rootPath, czg.configPath)
  await exec('npx', [czg.binPath, `--config=${czgConf}`], { cwd: rootPath, stdin: 'inherit' }, true)

  const commit = await gitlog({ repo: rootPath, number: 1, branch: 'origin/master..HEAD' })
  if (commit.length < 1) {
    logger.log(logger.NO_COMMIT)
    return process.exit(1)
  }

  const answer = await confirm({
    message: `Do you want to push now?(default y)`,
    default: true,
  })

  if (answer) {
    await gitPush()
    logger.log(chalk.green('Done!'))
  }
  else {
    process.exit(0)
  }
}
