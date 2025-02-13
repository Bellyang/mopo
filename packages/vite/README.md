# Vite Build Tool

The vite package provides project building and development server functionality based on Vite, serving as a modern build tool option.

## Docs

[vite](https://mopo-cli.vercel.app/extensions/vite)

## Core Features

1. **Build Features**
   - Production environment build support
   - Build analysis support (analyzer)
   - Custom build configuration
   - Multi-framework build support (via lib configuration)

2. **Development Server**
   - Built-in development server
   - Automatic server URL printing
   - CLI shortcut support
   - Real-time hot updates

3. **Configuration Management**
   - Default configuration generation
   - User configuration merging
   - Environment variable support
   - Repository root awareness

## API Reference

### Default Export Function

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

**Parameter Description:**
- `env`: Environment variable
- `path`: Project path
- `pkgName`: Package name
- `repoRoot`: Repository root directory
- `analyzer`: Whether to enable build analysis
- `pkg`: Package configuration information
- `isBuild`: Whether it's a production build (default false)

## Usage Flow

1. **Development Environment**
   ```typescript
   await viteBuilder({
     env: 'development',
     path: '/path/to/project',
     pkgName: 'my-app',
     repoRoot: '/path/to/repo',
     analyzer: false
   }, pkg)
   ```
   - Start development server
   - Display access URL
   - Support keyboard shortcuts

2. **Production Environment**
   ```typescript
   await viteBuilder({
     env: 'production',
     path: '/path/to/project',
     pkgName: 'my-app',
     repoRoot: '/path/to/repo',
     analyzer: true
   }, pkg, true)
   ```
   - Execute production build
   - Optional build analysis
   - Output build files

## Features

1. **Flexible Configuration**
   - Support for merging default and user configurations
   - Environment variable differentiation
   - Build tool type detection

2. **Development Experience**
   - Fast hot updates
   - Friendly CLI interface
   - Convenient server access

3. **Build Optimization**
   - Optional build analysis
   - Multi-framework support
   - Custom build configuration