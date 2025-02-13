import { defineConfig, type Options } from 'tsup'

import configs from './generator'
// If you want to use await import in CJS and not have it transformed to require,
// you need to set the package splitting: false, and tsconfig.json to target: es2020
export default defineConfig(({ watch, dts }: Options) => configs({ watch, dts }))
