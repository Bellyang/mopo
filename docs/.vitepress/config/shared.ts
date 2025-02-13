import flexSearchIndexOptions from 'flexsearch'

import { defineConfig } from 'vitepress'
import { SearchPlugin } from 'vitepress-plugin-search'

const options = {
  ...flexSearchIndexOptions,
  encode: false,
  tokenize: 'full',
  previewLength: 100,
  // buttonLabel: "搜索",
  // placeholder: "情输入关键词",
}

export const shared = defineConfig({
  title: 'Mopo',
  base: '/',
  lastUpdated: true,
  cleanUrls: true,
  vite: { plugins: [SearchPlugin(options)] },
  head: [
    ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' }],
    ['link', { rel: 'manifest', href: '/site.webmanifest' }],
    ['link', { rel: 'shortcut icon', href: '/favicon.ico' }],
  ],
  themeConfig: {
    logo: '/logo.png',
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Bellyang/Mopo' },
    ],
    search: {
      provider: 'local',
      options: {
        locales: {
          zh: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档',
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换',
                },
              },
            },
          },
        },
      },
    },
  },
  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark',
    },
  },
})
