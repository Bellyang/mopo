import { createConfigLoader } from '../../utils/createConfigLoader'

export default createConfigLoader({
  moduleName: 'release-it',
  searchPlaces: [
    'release-it.js',
    'release-it.ts',
    'release-it.json',
    'release-it.yaml',
    'release-it.yml',
    'package.json',
  ],
  packageProp: ['release-it'],
})
