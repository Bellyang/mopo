import vue from './plugin-vue/index.mjs'
import vueJsx from '@vitejs/plugin-vue-jsx'

export default () => [
  vue(),
  vueJsx(),
]
