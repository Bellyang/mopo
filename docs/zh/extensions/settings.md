# 配置管理

settings 包提供项目配置的管理和处理功能，通过内置配置文件作为默认配置项，并提供工具函数和模块，用于定义项目配置、加载配置文件、校验、解析路径等操作。

## 核心功能

1. **配置解析与加载**
   - 通过 `configLoader` 加载配置文件
   - 使用 `generateConfig` 生成标准配置
   - 提供 `defineConfig` 工具函数，支持类型提示

2. **路径解析**
   - 通过 `resolver` 模块处理路径解析
   - 使用 `configPath` 管理配置文件路径


## API 参考

### defineConfig

```typescript
function defineConfig(config: MopoConfig): MopoConfig
```

用于定义项目配置，提供完整的类型提示支持。

**参数：**
- `config`: Mopo 项目配置对象

**返回值：**
- 返回经过类型检查的配置对象

**使用示例：**
```typescript
import { defineConfig } from '@mopo/settings'

export default defineConfig({
  // 配置内容
  outputDir: 'root',
  publicPath: '/',
  // ...其他配置
})
```

### 工具模块

- **resolver**: 提供路径解析相关功能
- **configPath**: 处理配置文件路径
- **configLoader**: 配置文件加载器
- **generateConfig**: 配置生成工具

## 使用场景

1. 项目配置定义
2. 配置文件加载和解析
3. 路径解析和管理
