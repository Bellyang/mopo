# Webpack Build Tool

The webpack package provides Webpack-based project building and development server functionality. Currently, Webpack remains the most widely used, ecosystem-rich, and stable build tool.

## Docs

(webpack)[https://mopo-cli.vercel.app/extensions/webpack]

## Core Features

1. **Build Functionality**
   - Production environment build support
   - Build process visualization (using spinner for progress display)
   - Asset information statistics and display
   - Build cache cleaning

2. **Development Server**
   - Integrated webpack-dev-server
   - Hot module replacement support
   - Custom server configuration

3. **Error Handling**
   - Complete error capture mechanism
   - Build error visualization
   - Compilation warning notifications

## API Reference

### Default Export Function

```typescript
async function webpackBuilder(
  configs: BuildParams,
  pkg: Package,
  isBuild: boolean = false
): Promise<void>
```

**Parameters:**
- `configs`: Build parameter configuration
- `pkg`: Package information
- `isBuild`: Production build flag (defaults to false)

## Usage Flow

1. **Development Environment**
   ```typescript
   await webpackBuilder(configs, pkg)
   ```
   - Start development server
   - Support hot reloading
   - Real-time compilation feedback

2. **Production Environment**
   ```typescript
   await webpackBuilder(configs, pkg, true)
   ```
   - Execute production build
   - Display build progress
   - Output build results

## Features

1. **Error Handling Optimization**
   - Using await-to-js for async error handling
   - Graceful error display degradation
   - Detailed error stack information

2. **Build Process Visualization**
   - Build progress display using spinner
   - Clear build status feedback
   - Instant build result display

3. **Asset Analysis**
   - Build asset statistics support
   - Asset information visualization
