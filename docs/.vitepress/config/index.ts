import { defineConfig } from 'vitepress'
import { en } from './en.ts'
import { shared } from './shared.ts'
import { zh } from './zh.ts'

export default defineConfig({
  ...shared,
  locales: {
    root: { label: 'English', ...en },
    zh: { label: '中文', ...zh },
  },
})
