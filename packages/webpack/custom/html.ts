import type { TConfig } from '@mopo/shared'

import HtmlWebpackPlugin from 'html-webpack-plugin'

const VALID_INJECT_OPTIONS = ['body', 'head'] as const
const DEFAULT_CHUNKS = ['chunk-vendors', 'chunk-common', 'main'] as const
const VALID_SCRIPT_LOADING = ['blocking', 'defer', 'module', 'systemjs-module'] as const

interface MultiPageConfig {
  title?: string
  template?: string
  filename?: string
  chunks?: string[]
  inject?: boolean | typeof VALID_INJECT_OPTIONS[number]
  scriptLoading?: typeof VALID_SCRIPT_LOADING[number]
}

function paramsChecker(params: MultiPageConfig) {
  const requiredStringParams = ['title', 'template', 'filename'] as const

  if (requiredStringParams.some(param => !params[param]))
    return false

  if (params.inject !== undefined
    && typeof params.inject !== 'boolean'
    && !VALID_INJECT_OPTIONS.includes(params.inject)) {
    return false
  }

  if (params.scriptLoading !== undefined
    && !VALID_SCRIPT_LOADING.includes(params.scriptLoading)) {
    return false
  }

  return true
}

export function geneHTML({
  title = '',
  inject = 'body',
  scriptLoading = 'defer',
  template = './index.html',
  filename = 'index.html',
  chunks = [...DEFAULT_CHUNKS],
}: MultiPageConfig = {}): HtmlWebpackPlugin {
  return new HtmlWebpackPlugin({
    title,
    chunks,
    inject,
    template,
    filename,
    baseUrl: '/',
    scriptLoading,
  })
}

export default (
  { pages, pkgName }: { pages?: TConfig['pages'], pkgName: string } = { pkgName: '' },
) => {
  if (!pages || typeof pages !== 'object')
    return [geneHTML({ title: pkgName })]
  const entries = Object.entries(pages as Record<string, MultiPageConfig>)
  if (entries.length === 0)
    return [geneHTML({ title: pkgName })]

  return entries.map(([key, value]) => {
    if (!paramsChecker(value)) {
      throw new Error(
        `Invalid page configuration for "${key}". Required fields: title, template, filename. `
        + `Valid inject options: ${[...VALID_INJECT_OPTIONS, 'boolean'].join(', ')}. `
        + `Valid scriptLoading options: ${VALID_SCRIPT_LOADING.join(', ')}.`,
      )
    }

    return geneHTML({
      title: pkgName,
      ...value,
      chunks: value.chunks || ['chunk-vendors', 'chunk-common', key],
    })
  })
}
