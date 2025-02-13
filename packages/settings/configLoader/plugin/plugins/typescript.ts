import { createConfigLoader } from '../../utils/createConfigLoader'

export default createConfigLoader({
  moduleName: 'tsconfig',
  searchPlaces: ['tsconfig.json'],
})
