import { compression } from 'vite-plugin-compression2'

export default () => {
  return [
    compression({
      include: /.(js|css)$/,
      filename: '[path][base].gz',
      algorithm: 'gzip',
      threshold: 10240,
    }),
  ]
}
