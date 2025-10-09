# secret-guardian-ts

A plug-and-play TypeScript-compatible pre-commit & pre-push secret scanner. Installs git hooks on `npm install` and warns or blocks commits/pushes when potential secrets are detected.

## Features
- Auto-installs `pre-commit` and `pre-push` hooks during `npm install`.
- Scans staged files for common secret patterns.
- Two modes: `strict` (blocks automatically) and `prompt` (asks user to proceed).
- TypeScript source with compiled `dist/` for publishing.
- Installer banner prints your contact info (configure in package.json).

## Usage
Install:


```bash
npm install secret-guardian-ts --save-dev