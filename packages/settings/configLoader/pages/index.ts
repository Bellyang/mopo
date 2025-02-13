import type { NormalizedPages, PageConfig, Pages } from '@mopo/shared'

import { parse } from 'node:path'

const ErrorMessages = {
  INVALID_CONFIG: 'Invalid pages configuration',
} as const

function extendPage(page: string, name?: string) {
  return {
    entry: page,
    title: name || parse(page).name,
    template: './index.html',
    filename: 'index.html',
    minify: true,
  }
}

const indexPage = (page: string) => ({ index: extendPage(page) })

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && !Array.isArray(value) && value !== null
}

function generatePage(key: keyof PageConfig, value: PageConfig): PageConfig {
  const basePage = extendPage(key)
  const pageConfig = { ...basePage, ...value }
  return {
    title: pageConfig.title,
    entry: pageConfig.entry,
    filename: pageConfig.filename,
    template: pageConfig.template,
    minify: pageConfig.minify,
  }
}

export default (pages?: Pages): NormalizedPages => {
  if (
    !pages
    || typeof pages === 'string'
    || !isObject(pages)
    || Object.keys(pages).length === 0
  ) {
    return indexPage('main.ts')
  }

  const entries = Object.entries(pages).map(([key, value]): [string, PageConfig] => {
    if (typeof value === 'string') {
      return [key, extendPage(value, key)]
    }

    if (isObject(value)) {
      return [key, Object.keys(value).length === 0
        ? extendPage(key)
        : generatePage(key as keyof PageConfig, value)]
    }

    throw new Error(ErrorMessages.INVALID_CONFIG)
  })

  return Object.fromEntries(entries) as NormalizedPages
}
