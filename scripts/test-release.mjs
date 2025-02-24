import { join, relative, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync, execSync } from 'node:child_process'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REGISTRY = 'http://localhost:4873/'

function execCommand(command, options = {}) {
  try {
    return execSync(command, { stdio: 'inherit', ...options })
  } catch (error) {
    console.error(`Command execution failed: ${command}`)
    console.error(error.message)
    process.exit(1)
  }
}

function listPackages() {
  try {
    const res = execSync('pnpm m ls --json --depth=-1', { encoding: 'utf-8' })
    const pkgs = JSON.parse(res)
    return pkgs
      .map((m) => relative(join(__dirname, '..'), m.path))
      .filter((path) => Boolean(path) && !path.includes('docs'))
      .map((path) => path.replace(/\\/g, '/'))
  } catch (e) {
    console.error('Failed to get package list:', e.message)
    return []
  }
}

function checkPackageExists(location) {
  const name = location.replace(/\/$/, '').split('/').pop()
  const { stderr } = spawnSync('npm', ['view', `@mopo/${name}`, `--registry=${REGISTRY}`], { 
    encoding: 'utf-8',
    shell: true 
  })
  return !stderr?.includes('404 Not Found')
}
// use verdaccio(https://verdaccio.org/) as local package registry
// pls turn off scope packages` proxy setting in verdaccio config.yaml before run this script
async function releaseTest() {
  const packages = listPackages()
  if (!packages.length) {
    console.log('No packages found to publish')
    return
  }

  for (const pkg of packages) {
    if (pkg === 'docs') continue
    
    console.log(`\nProcessing package: ${pkg}`)
    const exists = checkPackageExists(pkg)
    
    if (exists) {
      console.log('Unpublishing existing package...')
      execCommand(`cd ${pkg} && npm unpublish --registry=${REGISTRY} --force`)
    }
    
    console.log('Publishing package...')
    execCommand(`cd ${pkg} && npm publish --registry=${REGISTRY}`)
  }
}

releaseTest().catch(error => {
  console.error('ublishing process error:', error)
  process.exit(1)
})
