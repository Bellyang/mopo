# Build Plugins

The plugins package provides a plugin extension mechanism during the build process, supporting the development and integration of custom build plugins.

## Background

As frontend build tools evolve, JavaScript-based build tools (like webpack) are gradually being replaced by next-generation high-performance build tools:
- esbuild (Go-based)
- rspack (Rust-based)

This trend has led to two major challenges:
1. Traditional build tool plugin ecosystems face deprecation (e.g., chain-webpack)
2. New tools (like Vite) have plugin systems that are not yet fully stable and undergo rapid version iterations

## Solution

The plugins package aims to provide a unified plugin layer to achieve:
- Standardized configuration of build parameters
- Cross-build tool plugin reusability
- Unified build experience
