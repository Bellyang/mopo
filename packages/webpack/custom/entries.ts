import type { Configuration } from '../../../index'

import { dict } from '@mopo/shared'

type EntryConfig = Record<string, string>
interface CustomConfig { entry: string }

const createEntry = (name: string, path: string): string => dict.entry(name, path)

export default (
  { path, pages }:
  { path: string, pages?: Configuration['pages'] },
): Configuration['pages'] => {
  const entries: EntryConfig = { index: dict.entry(path, './main.ts') }

  if (!pages || typeof pages !== 'object' || Object.keys(pages).length === 0)
    return entries

  Object.entries(pages).forEach(([access, config]) => {
    const pageEntry = typeof config === 'string' ? config : (config as CustomConfig)?.entry
    if (!pageEntry)
      throw new Error(`Entry configuration missing for page "${access}"`)
    entries[access] = createEntry(path, pageEntry)
  })

  return entries
}
