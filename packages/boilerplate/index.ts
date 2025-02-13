import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export { generatePackageJson } from './generate/packageJson'

export const templateDir = (name: 'vue2' | 'vue3' | 'react' | 'wrapper') => resolve(__dirname, './templates', name)
