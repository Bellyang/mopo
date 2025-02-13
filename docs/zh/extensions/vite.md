# Vite 构建工具

vite 包提供了基于 Vite 的项目构建和开发服务功能，作为现代化的构建工具选项。

## 核心功能

1. **构建功能**
   - 支持生产环境构建
   - 支持构建分析（analyzer）
   - 自定义构建配置
   - 支持多框架构建（通过 lib 配置）

2. **开发服务**
   - 内置开发服务器
   - 自动打印服务器 URL
   - CLI 快捷键支持
   - 实时热更新

3. **配置管理**
   - 默认配置生成
   - 用户配置合并
   - 环境变量支持
   - 仓库根目录感知

## API 参考

### 默认导出函数

```typescript
async function viteBuilder(
  {
    env,
    path,
    pkgName,
    repoRoot,
    analyzer
  }: {
    env: string,
    path: string,
    pkgName: string,
    repoRoot: string,
    analyzer: boolean
  },
  pkg: Package,
  isBuild: boolean = false
): Promise<void>
```

**参数说明：**
- `env`: 环境变量
- `path`: 项目路径
- `pkgName`: 包名称
- `repoRoot`: 仓库根目录
- `analyzer`: 是否启用构建分析
- `pkg`: 包配置信息
- `isBuild`: 是否为生产环境构建（默认 false）

## 使用流程

1. **开发环境**
   ```typescript
   await viteBuilder({
     env: 'development',
     path: '/path/to/project',
     pkgName: 'my-app',
     repoRoot: '/path/to/repo',
     analyzer: false
   }, pkg)
   ```
   - 启动开发服务器
   - 显示访问地址
   - 支持快捷键操作

2. **生产环境**
   ```typescript
   await viteBuilder({
     env: 'production',
     path: '/path/to/project',
     pkgName: 'my-app',
     repoRoot: '/path/to/repo',
     analyzer: true
   }, pkg, true)
   ```
   - 执行生产构建
   - 可选构建分析
   - 输出构建文件

## 特性

1. **灵活配置**
   - 支持默认配置和用户配置合并
   - 环境变量区分
   - 构建工具类型识别

2. **开发体验**
   - 快速的热更新
   - 友好的 CLI 界面
   - 便捷的服务器访问

3. **构建优化**
   - 可选的构建分析
   - 多框架支持
   - 自定义构建配置
