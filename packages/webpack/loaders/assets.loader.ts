export default () => [
  {
    test: /\.txt|xlsx/,
    type: 'asset/source',
    generator: {
      filename: 'assets/files/[name].[hash][ext][query]',
    },
  },
  {
    test: /\.(webp|png|jpe?g|gif)(\?.*)?$/,
    type: 'asset',
    parser: {
      dataUrlCondition: {
        maxSize: 10 * 1024,
      },
    },
    generator: {
      filename: 'assets/img/[name].[hash][ext][query]',
    },
  },
  {
    test: /\.(mp3|wav|flac|aac)(\?.*)?$/,
    type: 'asset/resource',
    generator: {
      filename: 'assets/audio/[name].[hash][ext][query]',
    },
  },
  {
    test: /\.(mp4|webm|ogg)(\?.*)?$/,
    type: 'asset/resource',
    generator: {
      filename: 'assets/video/[name].[hash][ext][query]',
    },
  },
  {
    test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
    type: 'asset',
    parser: {
      dataUrlCondition: {
        maxSize: 10 * 1024,
      },
    },
    generator: {
      filename: 'assets/fonts/[name].[hash][ext][query]',
    },
  },
]
