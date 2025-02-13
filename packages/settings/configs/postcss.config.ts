import { browser } from '@mopo/shared'

import { req } from '../utils/resolver'

const AUTOPREFIXER_CONFIG = {
  overrideBrowserslist: browser.css,
  grid: true,
}

export default {
  syntax: req.resolve('postcss-scss'),
  plugins: [
    [req(req.resolve('postcss-preset-env'))({ browsers: browser.css, autoprefixer: AUTOPREFIXER_CONFIG })],
    [req(req.resolve('postcss-modules'))({})],
  ],
}
