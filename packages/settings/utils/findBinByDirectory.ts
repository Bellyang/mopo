import * as path from 'node:path'
import * as fs from 'node:fs'
import * as os from 'node:os'

function findBinDirectory(): string {
  // Local search: Traverse up the directory from the current file
  let currentDir: string = __dirname
  while (currentDir !== path.parse(currentDir).root) {
    const candidate = path.join(currentDir, 'node_modules', '.bin')
    if (fs.existsSync(candidate)) return candidate
    currentDir = path.dirname(currentDir)
  }

  // Global search: Derive through npm configuration and environment variables
  const fallbackPaths: string[] = []

  // Derive through npm_config_prefix
  if (process.env.npm_config_prefix) {
    const globalPath = path.join(process.env.npm_config_prefix, 'lib/node_modules/.bin')
    fallbackPaths.push(globalPath)
  }

  // Operating system default paths
  if (os.platform() === 'win32') {
    fallbackPaths.push(path.join(process.env.APPDATA || '', 'npm/node_modules/.bin'))
  } else {
    fallbackPaths.push('/usr/local/lib/node_modules/.bin', '/usr/lib/node_modules/.bin')
  }

  // Attempt to find the first existing path
  for (const fp of fallbackPaths) {
    if (fs.existsSync(fp)) return fp
  }

  throw new Error('Could not locate .bin directory')
}

function findBinByDirectory(name: string): string {
  const dict = findBinDirectory()
  return path.join(dict, name)
}

export { findBinByDirectory }
