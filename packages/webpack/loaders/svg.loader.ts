import { req } from '../utils/resolver'

export default () => [
  {
    test: /\.svg$/,
    exclude: /node_modules/,
    issuer: (val: string) => /^null$/.test(val),
    use: [
      {
        loader: req.resolve('svg-sprite-loader'),
        options: { symbolId: 'icon-[name]' },
      },
    ],
  },
  {
    test: /\.svg$/,
    exclude: /node_modules/,
    issuer: (val: string) => !/^null$/.test(val),
    type: 'asset',
    parser: {
      dataUrlCondition: { maxSize: 10 * 1024 },
    },
    generator: { filename: 'assets/svg/[name].[hash][ext][query]' },
  },
]
