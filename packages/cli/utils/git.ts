import { exec } from './commadExecutor'

// Add timeout and better typing for diff options
interface DiffOptions {
  filter?: string[]
  type?: '--name-only' | '--name-status' | '--numstat'
  timeout?: number
}

export async function diff({ filter = [], type = '--name-only', timeout = 30000 }: DiffOptions = {}): Promise<string[]> {
  try {
    const stdout = await exec('git', ['diff', type, '--ignore-space-at-eol', '--no-ext-diff', '-M100%', ...filter], {
      maxBuffer: Infinity,
      timeout,
    })
    return typeof stdout === 'string' ? stdout.trim().split('\n').filter(Boolean) : []
  }
  catch (error) {
    console.error('Git diff failed:', error)
    return []
  }
}

export async function getGitRootPath(): Promise<string> {
  try {
    const path = await exec('git', ['rev-parse', '--show-toplevel'], { encoding: 'utf8' }) as string
    if (!path)
      throw new Error('Git root path not found')
    return path.trim()
  }
  catch (error) {
    throw new Error(`Failed to get git root path: ${error}`)
  }
}

export async function getGitDirPath(cwd: string): Promise<string> {
  if (!cwd)
    throw new Error('Working directory is required')
  try {
    const path = await exec('git', ['rev-parse', '--absolute-git-dir'], { encoding: 'utf8', cwd }) as string
    if (!path)
      throw new Error('Git dir path not found')
    return path.trim()
  }
  catch (error) {
    throw new Error(`Failed to get git dir path: ${error}`)
  }
}

export function isWorkingDirClean() {
  return exec('git', ['diff', '--quiet', 'HEAD']).then(
    () => true,
    () => false,
  )
}

export async function gitCheckIsInsideWorkTree(cwd: string): Promise<boolean> {
  if (!cwd)
    throw new Error('Working directory is required')
  try {
    const stdout = await exec('git', ['rev-parse', '--is-inside-work-tree'], { cwd }) as string
    return stdout === 'true'
  }
  catch (error) {
    throw new Error(`Failed to get git dir path: ${error}`)
  }
}

export async function gitAddFiles(files: string[]): Promise<void> {
  if (!files.length)
    return
  try {
    await exec('git', ['add', ...files], { stdin: 'inherit' })
  }
  catch (error) {
    throw new Error(`Failed to add files: ${error}`)
  }
}

export async function gitAddAll() {
  await exec('git', ['add', '-N', '--no-all', '.'])
}

export async function gitPush() {
  await exec('git', ['push'])
}
