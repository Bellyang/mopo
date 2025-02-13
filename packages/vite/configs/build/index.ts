import type { BuildOptions } from 'vite'

import { relative } from 'node:path'
import { dict } from '@mopo/shared'

export default async (path: string, repoRoot: string, pkgName: string, outputDir: 'root' | 'package'): Promise<BuildOptions> => {
  const pkg = pkgName.includes('/') ? pkgName.split('/')[1] : pkgName
  const outDir = outputDir === 'root' ? relative(dict.target(path), dict.dist(repoRoot, pkg)) : dict.dist(repoRoot, pkgName)

  return {
    target: 'es2015',
    minify: 'terser',
    outDir,
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    emptyOutDir: true,
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules'))
            return 'vendor'
        },
        chunkFileNames: 'assets/js/[name].[hash:8].js',
        entryFileNames: 'assets/js/[name].[hash:8].js',
        assetFileNames: 'assets/[ext]/[name].[hash:4].[ext]',
      },
    },
  }
}
