import { browser } from '@mopo/shared'

import { req } from '../../utils/resolver'

export default {
  sourceType: 'unambiguous',
  include: [/\.vue$/, /\.ts$/, /\.tsx$/, /\.jsx$/, /\.js$/],
  // extensions: ['.vue', '.ts', '.js', '.tsx', '.jsx'],
  exclude: /node_modules/,
  presets: [
    [
      req.resolve('@babel/preset-env'),
      {
        useBuiltIns: 'usage',
        corejs: '3',
        targets: { browsers: browser.medium },
      },
    ],
  ],
}
