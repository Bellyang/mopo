import { defineConfig } from 'vitepress'

export const zh = defineConfig({
  lang: 'zh-CN',
  description: '文档描述',
  themeConfig: {
    editLink: {
      pattern: '',
      text: '在 GitHub 上编辑此页面',
    },
    nav: [
      { text: '首页', link: '/zh/Index' },
      { text: '📖 指引', link: '/zh/guide/Introduction', activeMatch: '/zh/guide/' },
      { text: '🛠️ 配置', link: '/zh/config/project', activeMatch: '/zh/config/' },
    ],
    sidebar: [
      {
        text: '指引',
        items: [
          { text: '介绍', link: '/zh/guide/Introduction' },
          { text: '快速开始', link: '/zh/guide/get-started' },
          { text: '命令', link: '/zh/guide/commands' },
        ],
      },
      {
        text: '配置项',
        items: [
          { text: '项目', link: '/zh/config/project' },
          { text: '配置文件', link: '/zh/config/configs' },
          { text: '完整配置参考', link: '/zh/config/complete' },
        ],
      },
      {
        text: '扩展',
        items: [
          { text: '@mopo/boilerplate', link: '/zh/extensions/boilerplate' },
          { text: '@mopo/settings', link: '/zh/extensions/settings' },
          { text: '@mopo/plugins', link: '/zh/extensions/plugins' },
          { text: '@mopo/webpack', link: '/zh/extensions/webpack' },
          { text: '@mopo/vite', link: '/zh/extensions/vite' },
        ],
      },
    ],
    footer: {
      message: '基于 MIT 许可证发布。',
      copyright: '版权 © 2025-present Bell Yang',
    },
  },
})
