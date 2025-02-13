import assetsLoader from './assets.loader'
import svgLoader from './svg.loader'

export default () => {
  return [
    ...svgLoader(),
    ...assetsLoader(),
  ]
}
