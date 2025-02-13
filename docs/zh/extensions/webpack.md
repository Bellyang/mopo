# Webpack 构建工具

webpack 包提供了基于 Webpack 的项目构建和开发服务功能，目前来看webpack依然是使用最广，生态最全、最稳定的构建工具。

## 核心功能

1. **构建功能**
   - 支持生产环境构建
   - 构建过程可视化（使用 spinner 展示进度）
   - 资源信息统计和展示
   - 构建缓存清理

2. **开发服务**
   - 集成 webpack-dev-server
   - 支持开发环境热更新
   - 自定义服务器配置

3. **错误处理**
   - 完整的错误捕获机制
   - 构建错误可视化展示
   - 编译警告信息提示

## API 参考

### 默认导出函数

```typescript
async function webpackBuilder(
  configs: BuildParams,
  pkg: Package,
  isBuild: boolean = false
): Promise<void>
```

**参数：**
- `configs`: 构建参数配置
- `pkg`: 包信息
- `isBuild`: 是否为生产环境构建（默认为 false）

## 使用流程

1. **开发环境**
   ```typescript
   await webpackBuilder(configs, pkg)
   ```
   - 启动开发服务器
   - 支持热更新
   - 实时编译反馈

2. **生产环境**
   ```typescript
   await webpackBuilder(configs, pkg, true)
   ```
   - 执行生产构建
   - 显示构建进度
   - 输出构建结果

## 特性

1. **错误处理优化**
   - 使用 await-to-js 处理异步错误
   - 优雅降级的错误展示
   - 详细的错误堆栈信息

2. **构建过程可视化**
   - 使用 spinner 展示构建进度
   - 清晰的构建状态反馈
   - 构建结果即时展示

3. **资源分析**
   - 支持构建资源统计
   - 资源信息可视化展示
