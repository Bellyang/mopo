import type { TConfig } from '@mopo/shared'
import type { PluginOption } from 'vite'

import { resolve } from 'node:path'
import { createHtmlPlugin } from '@mopo/vite-plugin-html'

function inject(title: string = '') {
  return {
    ejsOptions: {
      escape: (markup: string | undefined) => {
        return markup === undefined ? '' : String(markup)
      },
    },
    data: {
      process: {
        env: { TIME_BUILDED: JSON.stringify(new Date().valueOf()) },
      },
      htmlWebpackPlugin: {
        options: { title },
      },
    },
  }
}

export default (path: string, root: string, pages: TConfig['pages']): PluginOption[] => {
  const pageConfig = Object.entries(pages).map(([_key, value]) => {
    return {
      entry: value.entry,
      filename: value.filename,
      template: value.template,
      minify: value.minify,
      injectOptions: inject(value.title),
    }
  })

  return [
    createHtmlPlugin({
      pages: pageConfig,
      cwd: resolve(root, path),
    }) as PluginOption[],
  ]
}
