import { createConfigLoader } from '../../utils/createConfigLoader'

export default createConfigLoader({
  moduleName: 'lintstaged',
  searchPlaces: [
    'lintstaged.config.js',
    'lintstaged.config.mjs',
    'lintstaged.config.cjs',
    'lintstaged.config.ts',
    'lintstaged.config.mts',
    'lintstaged.config.cts',
    'package.json',
  ],
  packageProp: ['lint-staged'],
})
