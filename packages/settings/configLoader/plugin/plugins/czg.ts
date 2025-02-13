import { createConfigLoader } from '../../utils/createConfigLoader'

export default createConfigLoader({
  moduleName: 'czg',
  searchPlaces: [
    'czg.config.js',
    'czg.config.mjs',
    'czg.config.cjs',
    'czg.config.ts',
    'czg.config.mts',
    'czg.config.cts',
    'package.json',
  ],
  packageProp: ['config', 'commitizen'],
})
