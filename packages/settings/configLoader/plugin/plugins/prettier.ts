import { createConfigLoader } from '../../utils/createConfigLoader'

export default createConfigLoader({
  moduleName: 'prettier',
  searchPlaces: [
    'prettierrc',
    'prettier.config.js',
    'prettier.config.mjs',
    'prettier.config.cjs',
    'prettier.config.json',
    'prettier.config.yaml',
    'prettier.config.yml',
    'package.json',
  ],
  packageProp: ['prettier'],
})
