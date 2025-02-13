# Configuration Management

The settings package provides project configuration management and processing functionality, using built-in configuration files as default options, and offers utility functions and modules for defining project configurations, loading configuration files, validation, and path resolution.

## Docs

(settings)[https://mopo-cli.vercel.app/extensions/settings]

## Core Features

1. **Configuration Parsing and Loading**
   - Load configuration files via `configLoader`
   - Generate standard configurations using `generateConfig`
   - Provide `defineConfig` utility function with type hints support

2. **Path Resolution**
   - Handle path resolution through the `resolver` module
   - Manage configuration file paths using `configPath`

## API Reference

### defineConfig

```typescript
function defineConfig(config: MopoConfig): MopoConfig
```

Used to define project configuration with complete type hint support.

**Parameters:**
- `config`: Mopo project configuration object

**Returns:**
- Returns the type-checked configuration object

**Usage Example:**
```typescript
import { defineConfig } from '@mopo/settings'

export default defineConfig({
  // Configuration content
  outputDir: 'root',
  publicPath: '/',
  // ...other configurations
})
```

### Utility Modules

- **resolver**: Provides path resolution functionality
- **configPath**: Handles configuration file paths
- **configLoader**: Configuration file loader
- **generateConfig**: Configuration generation tool

## Use Cases

1. Project configuration definition
2. Configuration file loading and parsing
3. Path resolution and management