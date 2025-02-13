# Mopo: 新一代Monorepo开发工具集

## 简介

Mopo 是一个全生命周期的 CLI 工具，专为现代Monorepo开发设计，提供从编码到生产部署的全面解决方案。为追求效率和标准化的工程团队打造，它提供：

## 1. 原生Monorepo支持
**核心优势：**
- 统一的依赖管理
- 跨项目依赖解析
- 多包同步开发
- 支持 npm/yarn/pnpm 工作区配置

**工作区示例：**
::: code-group

```json [package.json]
{
  "workspaces": [
    "projects/web-*"
  ]
}
```

```yaml [pnpm-workspace.yaml]
packages:
  - 'packages/**'
  - '!packages/__test__/**'
```

:::

## 2. 构建系统无关性
**当前支持：**
- Webpack（默认）
- Vite（现代替代方案）

**路线图：**
- Rspack（基于 Rust）
- ESBuild（超快速）

**使用示例：**
```bash
# 默认 webpack 构建
mopo serve --name=@yourOrg/project-name

# 使用 Vite 开发
mopo serve --name=@yourOrg/project-name --bundler=vite

# 生产环境构建
mopo build --name=@yourOrg/project-name
```

## 3. 通用框架支持
**多框架生态系统：**
- Vue 2/3（自动版本检测）
- React 16.8+（完整 Hooks 支持）
- 框架共存模式

## 4. 现代开发工具链
**前沿特性：**
- 一流的 TypeScript 支持
- 智能 TSConfig 继承
- 内置代码检查器（ESLint）
- 集成测试运行器（Vitest/Jest）

## 5. 零配置理念
**项目结构对比：**
```
传统设置（11+ 配置文件）
├── .eslintrc.js
├── .prettierrc
├── babel.config.js
├── webpack.config.js
├── postcss.config.js
└── ...(另外 8 个)

Mopo 项目（代码优先）
├── code/            # 纯业务逻辑
└── package.json    # 简洁的依赖声明
```

**主要优势：**
- 自动配置生成
- 隐藏复杂性管理
- 标准化的跨项目约定
- 一键依赖同步

## 为什么选择 Mopo？
1. **单体仓库优化** - 简化多包工作流
2. **技术栈自由** - 混合框架和构建工具
3. **面向未来** - 现代标准与升级路径
4. **团队效率** - 减少配置和维护开销

使用 `mopo init` 启动你的下一个项目，体验重新定义的现代单体仓库开发。

> *注：兼容 Node.js 最新版本，可通过 `npm install -g @mopo/cli` 安装*
