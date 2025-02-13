# 快速入门指南

## 1. 安装

::: tip
Node 版本要求  
Mopo 需要 Node 18+ 版本。我们建议使用 n、nvm、volta 或 fnm 等 Node 版本管理器来切换 Node 版本。
:::

使用你喜欢的包管理器全局安装 Mopo CLI：

::: code-group

```bash [npm]
npm install -g @mopo/cli
```

```bash [pnpm]
pnpm add -g @mopo/cli
```

```bash [yarn]
yarn global add @mopo/cli
```

:::

安装完成后，验证安装：

```bash
mopo -v  # 检查版本
mopo -h  # 显示帮助
```

## 2. 升级

更新到最新版本：

::: code-group

```bash [npm]
npm update -g @mopo/cli
```

```bash [pnpm]
pnpm update -g @mopo/cli
```

```bash [yarn]
yarn global update --latest @mopo/cli
```

:::

## 3. 创建仓库

初始化一个新的 monorepo：

```bash
mopo init repoName      # 创建新仓库
mopo init .             # 使用当前目录
```

生成的目录结构：
```
repoName/
├── packages/            # 默认工作区
├── .gitignore          # Git 忽略规则
├── package.json        # 工作区配置（npm/yarn）
└── pnpm-workspace.yaml # PNPM 工作区配置
```

## 4. 创建项目

在 monorepo 中搭建新项目：

```bash
mopo create projectName  # 新项目
mopo create .           # 当前目录
```

CLI 将会：
1. 检测工作区配置
2. 提示选择框架（Vue 2/3 或 React）
3. 生成项目结构

## 5. 启动开发服务器

启动开发环境：

```bash
mopo serve -n projectName       # 按名称启动
mopo serve -d                   # 基于 Git 变更智能检测
mopo serve projectName -b vite  # 使用 Vite 打包器
```

通过显示的端口在浏览器中访问。

## 6. 构建项目

生产环境构建命令：

```bash
mopo build -n projectName      # 构建指定项目
mopo build -d                  # 基于 Git 变更构建
mopo build projectName -b vite # 使用 Vite 构建
```

## 7. 提交更改

使用 Conventional Commit 规范化提交：

```bash
mopo commit -n projectName  # 提交指定项目
mopo commit -d             # 基于 Git 变更提交
```

特性：
- 交互式提交提示
- 提交信息验证
- 由 [cz-git](https://github.com/Zhengqbbb/cz-git) 驱动

## 8. 发布包

版本管理与发布：

```bash
mopo release -a                   # 统一版本升级所有包
mopo release -d                   # 基于 Git 变更智能检测
mopo release -n @yourOrg/pkg-name # 依赖包的版本级联
```

主要特性：
- 通过 [release-it](https://github.com/release-it/release-it) 生成 CHANGELOG
- 工作区感知的版本控制
- 双重发布模式：统一版本或级联版本

---

> 提示：使用 `mopo [command] --help` 查看详细的选项说明。  
> 示例：`mopo serve --help` 显示所有 serve 命令选项。
