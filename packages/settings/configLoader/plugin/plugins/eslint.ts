import { createConfigLoader } from '../../utils/createConfigLoader'

export default createConfigLoader({
  moduleName: 'eslint',
  searchPlaces: [
    'eslint.config.js',
    'eslint.config.mjs',
    'eslint.config.cjs',
    'eslint.config.ts',
    'eslint.config.mts',
    'eslint.config.cts',
    'package.json',
  ],
  packageProp: ['eslintConfig'],
})
