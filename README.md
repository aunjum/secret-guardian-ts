# 🔐 secret-guardian-ts

[![npm version](https://badge.fury.io/js/secret-guardian-ts.svg)](https://www.npmjs.com/package/secret-guardian-ts)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A plug-and-play `pre-commit` and `pre-push` secret scanner for Node/TypeScript projects.  
It installs hooks automatically and blocks or prompts when secrets are detected in staged code.

## ✨ Features

- Auto-installs `pre-commit` and `pre-push` hooks on install
- Scans **staged git content** (not just working tree files) to reduce bypass risk
- Shows `file path + line number + masked snippet` for each finding
- Supports `prompt` mode and `strict` mode
- Defaults to secure fail-closed behavior on runtime scanner errors
- Expanded detection set: AWS keys, private keys, passwords, JWTs, GitHub tokens, Slack tokens, OpenAI keys, and generic API keys
- Ships ESM + CJS + type definitions

## 📦 Installation

```bash
npm install secret-guardian-ts --save-dev
```

Hooks are installed automatically in `.git/hooks`.

## 🚀 How it works

1. You stage files with `git add`.
2. On commit/push, Secret Guardian scans staged content.
3. If secrets are found, it prints findings with context:

```text
• src/config.ts:12 (OpenAI API Key)
  OPENAI_API_KEY = "sk-a***9z"
```

## ⚙️ Configuration

Add a `secretGuardian` section in your `package.json`:

```json
{
  "secretGuardian": {
    "mode": "prompt",
    "contact": {
      "name": "Your Name",
      "email": "your.email@example.com",
      "website": "https://example.com",
      "whatsapp": "+1234567890",
      "country": "Your Country"
    },
    "banner": {
      "enabled": true,
      "message": "Custom installation message"
    }
  }
}
```

### Modes

- `prompt` (default): asks whether to proceed when secrets are found
- `strict`: blocks commit/push when secrets are found

Set mode via environment variable:

```bash
export SECRET_GUARDIAN_MODE=strict
```

### Error behavior

By default, scanner runtime errors fail closed (block commit/push).  
If you explicitly want fail-open behavior:

```bash
export SECRET_GUARDIAN_FAIL_OPEN=true
```

## 🔍 Detected patterns

Current detections include:

- AWS Access Key ID
- AWS Secret Access Key (assignment-style matches)
- Private key headers
- Generic password assignments
- JWT tokens
- GitHub tokens (`ghp_`, `gho_`, `ghu_`, `ghs_`, `ghr_`)
- Slack tokens (`xoxb-`, `xoxa-`, etc.)
- OpenAI API keys (`sk-...`)
- Generic API key assignments

## 🔧 Manual hook installation

```bash
npx secret-guardian install-hooks
```

Or:

```bash
node ./node_modules/secret-guardian-ts/dist/index.cjs --install-hooks
```

## 🧪 Development

```bash
npm install
npm run build
npm test
npm run lint
```

## 📝 Scripts

- `npm run build` - Build with tsup (ESM + CJS + d.ts)
- `npm test` - Run Jest tests
- `npm run test:watch` - Run Jest in watch mode
- `npm run lint` - Type-check with TypeScript
- `npm run prepublishOnly` - Build and test before publish

## 📄 License

MIT - see [LICENSE](LICENSE).

## 👤 Author

**Tanvir Aunjum**
- Email: tanviraunjum030@gmail.com
- Website: https://tanviraunjum.space
- WhatsApp: +8801611756322
- Country: Bangladesh
