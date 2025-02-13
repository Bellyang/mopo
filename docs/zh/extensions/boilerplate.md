# 项目模板

boilerplate 包主要提供项目模板和项目初始化相关功能。

## 核心功能

1. **模板管理**
   - 支持多种框架的项目模板
   - 当前支持的模板类型：
     - Vue 2
     - Vue 3
     - React
     - Wrapper（包装器模板）
   - 通过 `templateDir` 函数统一管理模板目录路径

2. **项目初始化**
   - 提供 `generatePackageJson` 工具函数
   - 用于生成项目的 package.json 配置文件
   - 确保项目依赖和配置的标准化

## API 参考

### templateDir

```typescript
function templateDir(name: 'vue2' | 'vue3' | 'react' | 'wrapper'): string
```

目前此包功能还比较简单，后续会将cli中创建仓库和项目的功能集成进此包。

## 演进路线 (Roadmap)

### 近期规划
1. **场景化模板扩展**
   - SSR 服务端渲染模板 (Next.js/Nuxt.js)
   - 小程序开发 (Wepy/Mpvue)
   - 微前端架构模板 (qiankun/Module Federation)
   - 组件库开发模板 (Storybook + Theme System)

2. **框架生态增强**
   - Svelte 轻量框架支持
   - 集成 Preact 高性能替代方案
   - Deno 运行时环境适配

### 更多
- 可视化模板配置界面 (Web Dashboard)
- 企业私有模板仓库支持
- CI/CD 流水线自动集成



