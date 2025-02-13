import type { PluginOption } from 'vite'
import type { UserOptions } from './typing'
import consola from 'consola'
import { createPlugin } from './htmlPlugin'
import { createMinifyHtmlPlugin } from './minifyHtml'

consola.wrapConsole()

export function createHtmlPlugin(
  userOptions: UserOptions = {},
): PluginOption[] {
  return [createPlugin(userOptions), createMinifyHtmlPlugin(userOptions)]
}
