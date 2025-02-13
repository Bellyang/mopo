import { defineConfig } from 'vitepress'

export const en = defineConfig({
  lang: 'en-US',
  description: 'des',
  themeConfig: {
    editLink: {
      pattern: '',
      text: '在 GitHub 上编辑此页面',
    },
    nav: [
      { text: 'Home', link: '/' },
      { text: '📖 Guide', link: '/guide/Introduction', activeMatch: '/guide/' },
      { text: '🛠️ Configurations', link: '/config/project', activeMatch: '/config/' },
    ],
    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Introduction', link: '/guide/Introduction' },
          { text: 'Get started', link: '/guide/get-started' },
          { text: 'Commands', link: '/guide/commands' },
        ],
      },
      {
        text: 'Configurations',
        items: [
          { text: 'Project', link: '/config/project' },
          { text: 'Configuration Files', link: '/config/configs' },
          { text: 'Complete Configuration', link: '/config/complete' },
        ],
      },
      {
        text: 'Extensions',
        items: [
          { text: '@mopo/boilerplate', link: '/extensions/boilerplate' },
          { text: '@mopo/settings', link: '/extensions/settings' },
          { text: '@mopo/plugins', link: '/extensions/plugins' },
          { text: '@mopo/webpack', link: '/extensions/webpack' },
          { text: '@mopo/vite', link: '/extensions/vite' },
        ],
      },
    ],

    footer: {
      message: 'Published under the MIT License.',
      copyright: 'Copyright © 2025-present Bell Yang',
    },
  },
})
