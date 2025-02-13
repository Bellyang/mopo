import { dict } from '@mopo/shared'
import { visualizer } from 'rollup-plugin-visualizer'

export default ({ path, analyzer }: { path: string, analyzer: boolean }) => {
  if (!analyzer)
    return []
  return [
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
      projectRoot: dict.target(path),
      filename: dict.cache(__dirname, '/.vite/visualizer/stats.html'),
    }),
  ]
}
