The search didn't find the exact package. I'll assume `secret-guardian-ts` is **your own package** — a secrets/env variable validation/protection library written in TypeScript. The strategy below covers publishing a single codebase to npm (JS/TS), Rust (crates.io), Python (PyPI), Go (pkg.go.dev), and Dart/Flutter (pub.dev) via GitHub Actions.Here's a comprehensive guide for building a **multi-language, single-codebase SDK** that publishes to npm (JS/TS), crates.io (Rust), PyPI (Python), pkg.go.dev (Go), and pub.dev (Dart/Flutter) via GitHub Actions.Here's the full breakdown of how to execute this.

---

## Strategy: one monorepo, language-native wrappers

The cleanest approach is **not** to compile TypeScript into other languages — it's to write **thin native wrappers in each target language** that either:
- Re-implement the same logic (best for simple utilities like a secrets guardian)
- Or call a shared Rust/WASM core via FFI

For `secret-guardian-ts` (env/secrets validation), re-implementing in each language is actually the right call since the logic is straightforward and you get idiomatic, zero-dependency packages in each ecosystem.

---

## 1. JavaScript / TypeScript (npm, yarn, bun, pnpm)

Use **tsup** — it outputs ESM, CJS, and `.d.ts` in one command:

```ts
// tsup.config.ts
import { defineConfig } from 'tsup'
export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  splitting: false,
  clean: true,
})
```

```json
// package.json
{
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/index.cjs",
      "types": "./dist/index.d.ts"
    }
  }
}
```

This single config makes the package work with npm, yarn, bun, pnpm, ESM and CJS Node.js, and Deno (via npm: specifier).

---

## 2. Rust (crates.io)

Write a pure Rust crate in `packages/rust/`. No FFI needed — just reimplement the same logic:

```toml
# packages/rust/Cargo.toml
[package]
name = "secret-guardian"
version = "1.0.0"
edition = "2021"
```

---

## 3. Python (PyPI)

Use **maturin + PyO3** for a Rust-backed Python package, or plain Python if you prefer:

```toml
# packages/python/pyproject.toml
[build-system]
requires = ["maturin>=1.0"]
build-backend = "maturin"

[tool.maturin]
features = ["pyo3/extension-module"]
```

---

## 4. Go (pkg.go.dev)

A Go module is published by simply tagging — no registry upload needed. Put it in `packages/go/` with its own `go.mod`:

```go
// packages/go/go.mod
module github.com/yourusername/secret-guardian-go

go 1.21
```

Go users install via `go get github.com/yourusername/secret-guardian-go@v1.0.0`. The tag IS the publish event.

---

## 5. Dart / Flutter (pub.dev)

```yaml
# packages/dart/pubspec.yaml
name: secret_guardian
version: 1.0.0
environment:
  sdk: '>=3.0.0 <4.0.0'
```

---

## GitHub Actions workflows

### Shared release trigger (`ci.yml`)
```yaml
on:
  push:
    tags: ['v*.*.*']
```

All publish workflows listen to the same tag pattern and run in parallel.

### npm publish
```yaml
# .github/workflows/publish-npm.yml
name: Publish npm
on:
  push:
    tags: ['v*.*.*']
jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          registry-url: https://registry.npmjs.org
      - run: npm ci && npm run build
        working-directory: packages/js
      - run: npm publish --access public
        working-directory: packages/js
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

### crates.io publish
```yaml
# .github/workflows/publish-crates.yml
name: Publish crates.io
on:
  push:
    tags: ['v*.*.*']
jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: dtolnay/rust-toolchain@stable
      - run: cargo publish
        working-directory: packages/rust
        env:
          CARGO_REGISTRY_TOKEN: ${{ secrets.CARGO_TOKEN }}
```

### PyPI publish (maturin)
```yaml
# .github/workflows/publish-pypi.yml
name: Publish PyPI
on:
  push:
    tags: ['v*.*.*']
jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: PyO3/maturin-action@v1
        with:
          command: publish
          args: --manifest-path packages/python/Cargo.toml
        env:
          MATURIN_PYPI_TOKEN: ${{ secrets.PYPI_TOKEN }}
```

### Go (no upload needed — just tag)
```yaml
# .github/workflows/publish-go.yml
name: Tag Go module
on:
  push:
    tags: ['v*.*.*']
jobs:
  tag:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Push Go submodule tag
        run: |
          VERSION=${GITHUB_REF#refs/tags/}
          git tag "packages/go/${VERSION}"
          git push origin "packages/go/${VERSION}"
```

### pub.dev publish
```yaml
# .github/workflows/publish-dart.yml
name: Publish pub.dev
on:
  push:
    tags: ['v*.*.*']
jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: dart-lang/setup-dart@v1
      - name: Setup pub credentials
        run: |
          mkdir -p ~/.config/dart
          echo '${{ secrets.PUB_CREDENTIALS }}' > ~/.config/dart/pub-credentials.json
      - run: dart pub publish --force
        working-directory: packages/dart
```

---

## Version sync across all packages

The trickiest part. Use a root `version.json` or a script that reads from the git tag and updates all manifests before each publish:

```bash
# scripts/sync-version.sh
VERSION=${1:-$(git describe --tags --abbrev=0)}
VERSION_CLEAN=${VERSION#v}  # strips leading "v"

# JS
jq ".version = \"$VERSION_CLEAN\"" packages/js/package.json > tmp && mv tmp packages/js/package.json

# Rust
sed -i "s/^version = .*/version = \"$VERSION_CLEAN\"/" packages/rust/Cargo.toml

# Python
sed -i "s/^version = .*/version = \"$VERSION_CLEAN\"/" packages/python/pyproject.toml

# Dart
sed -i "s/^version: .*/version: $VERSION_CLEAN/" packages/dart/pubspec.yaml
```

Run this as the first step in every workflow: `./scripts/sync-version.sh ${{ github.ref_name }}`.

---

## Secrets to configure in GitHub

Go to **Settings → Secrets and variables → Actions** and add:

| Secret | Where to get it |
|---|---|
| `NPM_TOKEN` | npmjs.com → Access Tokens |
| `CARGO_TOKEN` | crates.io → Account Settings |
| `PYPI_TOKEN` | pypi.org → Account Settings → API tokens |
| `PUB_CREDENTIALS` | `dart pub token add` locally, copy `~/.config/dart/pub-credentials.json` |

Go needs no secret — the tag push IS the publish.

---

## Release flow summary

```bash
# bump, commit, tag
git add .
git commit -m "chore: release v1.2.0"
git tag v1.2.0
git push && git push --tags
```

That single `git push --tags` fires all 5 publish workflows in parallel. Click any node in the diagram above to dive deeper into any specific part.