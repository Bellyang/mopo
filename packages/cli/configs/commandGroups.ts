import type { CommandDescription } from '../types'

import chalk from 'chalk'

import { cliPkgInfo } from '../utils/projectInfo'

const commands: CommandDescription[] = [
  {
    name: 'args',
    args: '<command>',
  },
  {
    name: 'version',
    version: [`mopo/cli verison ${chalk.green(cliPkgInfo.version)}`, '-v, --version'],
    usage: ['<command> [options]'],
  },
  {
    name: 'init',
    command: ['init'],
    argument: ['<repo-name>'],
    description: 'Init a new monorepo',
  },
  {
    name: 'create',
    command: ['create'],
    argument: ['<app-name>'],
    description: 'Create a new project',
  },
  // {
  //   name: 'clean',
  //   command: ['clean'],
  //   description: 'Clean cache',
  // },
  {
    name: 'prepare',
    command: ['prepare'],
    options: [
      ['-c --cwd', 'Prepare path', process.cwd()],
    ],
    description: 'Init hooks',
  },
  {
    name: 'serve',
    command: ['serve'],
    prehooks: ['workspace'],
    options: [
      ['-a --all', 'Serve all', false],
      ['-an --analyzer', 'Analyzer bundle', false],
      ['-s --speed', 'Build speed measure', false],
      ['-p --prompt', 'Prompt to select serve projects.', false],
      ['-d --diff', 'Serve based on the results of "git diff"', false],
      ['-n --names [names...]', 'One or more project names be served in order.', []],
      ['-b --bundler [bundler]', 'Choose a bundling tool, default is webpack', 'webpack'],
    ],
    description: 'Start a new project',
  },
  {
    name: 'build',
    command: ['build'],
    prehooks: ['workspace'],
    options: [
      ['-a --all', 'Build all', false],
      ['-s --speed', 'Build speed measure, webpack only', false],
      ['-p --prompt', 'Prompt to select commit projects.', false],
      ['-d --diff', 'Build based on the results of "git diff"', false],
      ['-e --env [env]', 'Build a Input environment package', 'production'],
      ['-b --bundler [bundler]', 'Choose a bundling tool, default is webpack', 'webpack'],
      ['-n --names [names...]', 'One or more project names will be packaged in order.', []],
      ['-f --from [from]', `Diff from branch. If you use "diff" as the project name, it will build with the results from "git diff branch (from -b)"`, 'origin/master'],
    ],
    description: 'Build projects',
  },
  {
    name: 'commit',
    command: ['commit'],
    prehooks: ['workspace'],
    options: [
      ['-a --all', 'Commit all (Includes changes in the root directory)', false],
      ['-d --diff', 'Commit based on the results of "git diff"', false],
      ['-n --names [names...]', 'One or more project names, will be commited in order', []],
      ['-p --prompt', 'Prompt to select commit projects.', false],
    ],
    description: 'Git add and commit changes',
  },
  {
    name: 'release',
    command: ['release'],
    prehooks: ['workspace'],
    options: [
      ['-a --all', 'Release all', false],
      ['-d --diff', 'Release based on the results of "git diff"', false],
      ['--dry-run', 'Do not touch or write anything, but show the commands', false],
      ['-n --names [names...]', 'One or more project names, will be released in order', []],
      ['--ci', 'No prompts, no user interaction; activated automatically in CI environments', false],
      ['-v --verbose', 'Release-it\'s Extra Verbose output (user hooks output and internal commands output)', false],
      ['-s --sameVersion', 'All workspaces would be bumped to the same version and are published at the same time', false],
    ],
    description: 'Update changelogs, bump the version, and tag the commit',
  },
]

export { commands }
