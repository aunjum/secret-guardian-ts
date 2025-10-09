# 🔐 secret-guardian-ts

[![npm version](https://badge.fury.io/js/secret-guardian-ts.svg)](https://www.npmjs.com/package/secret-guardian-ts)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A **plug-and-play TypeScript-compatible pre-commit & pre-push secret scanner** that helps prevent accidentally committing secrets to your repository. Automatically installs git hooks during `npm install` and warns or blocks commits/pushes when potential secrets are detected.

## ✨ Features

- 🔒 **Auto-installs** `pre-commit` and `pre-push` hooks during `npm install`
- 🔍 **Scans staged files** for common secret patterns (AWS keys, private keys, passwords, JWT tokens, API keys)
- 🎯 **Two modes**: 
  - `strict` - Automatically blocks commits with secrets
  - `prompt` - Asks user to proceed (default)
- 📦 **TypeScript source** with compiled `dist/` for publishing
- 🎨 **Configurable banner** to print contact info during installation
- ⚡ **Zero configuration** - works out of the box
- 🧪 **Fully tested** with Jest

## 📦 Installation

```bash
npm install secret-guardian-ts --save-dev
```

That's it! The git hooks will be automatically installed.

## 🚀 Usage

After installation, the package automatically:

1. Installs `pre-commit` and `pre-push` hooks in your `.git/hooks/` directory
2. Scans your staged files before each commit
3. Alerts you if potential secrets are detected

### Basic Workflow

```bash
# Make changes to your code
echo "API_KEY='sk-1234567890abcdef'" > config.js

# Try to commit
git add config.js
git commit -m "Add config"

# Secret Guardian will detect the API key and warn you!
```

## ⚙️ Configuration

### Mode Configuration

You can configure the behavior by adding a `secretGuardian` section to your `package.json`:

```json
{
  "secretGuardian": {
    "mode": "prompt",
    "contact": {
      "name": "Your Name",
      "email": "your.email@example.com",
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

- **`prompt`** (default): Asks for confirmation when secrets are detected
- **`strict`**: Automatically blocks commits/pushes with secrets

You can also set the mode via environment variable:

```bash
export SECRET_GUARDIAN_MODE=strict
```

## 🔍 Detected Patterns

Secret Guardian currently detects:

| Pattern | Example | Regex |
|---------|---------|-------|
| AWS Access Key | `AKIAIOSFODNN7EXAMPLE` | `AKIA[0-9A-Z]{16}` |
| Private Key | `-----BEGIN RSA PRIVATE KEY-----` | `-----BEGIN (RSA )?PRIVATE KEY-----` |
| Generic Password | `password: "secret123"` | `password\s*[:=]\s*["'][^"']+["']` |
| JWT Token | `eyJhbGciOiJIUz...` | `eyJ[A-Za-z0-9_-]+?\..*` |
| API Key | `api_key: "abcd1234..."` | `api[_-]?key\s*[:=]\s*["'][A-Za-z0-9-_]{16,}["']` |

## 🧪 Testing Locally

You can test the scanner manually:

```bash
# Install the package
npm install secret-guardian-ts --save-dev

# Create a test file with a secret
echo "AWS_KEY=AKIAIOSFODNN7EXAMPLE" > test.txt

# Stage and try to commit
git add test.txt
git commit -m "test"

# Secret Guardian will detect the AWS key!
```

## 🛠️ Development

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/secret-guardian-ts.git
cd secret-guardian-ts

# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Type checking
npm run lint
```

## 📝 Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm test` - Run Jest tests
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Run TypeScript type checking
- `npm run prepare` - Auto-runs on `npm install` (builds the project)
- `npm run prepublishOnly` - Runs before publishing (builds and tests)

## 🔧 Manual Hook Installation

If hooks aren't installed automatically, you can install them manually:

```bash
npx secret-guardian install-hooks
```

Or using the Node CLI:

```bash
node ./node_modules/secret-guardian-ts/dist/index.js --install-hooks
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🐛 Known Issues

- On Windows, you might need to run `chmod +x .git/hooks/pre-commit` if hooks don't execute
- Large repositories (>1000 files) might experience slower scan times

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Tanvir Aunjum**
- Email: tanviraunjum030@gmail.com
- WhatsApp: +8801611756322
- Country: Bangladesh

## 🙏 Acknowledgments

- Built with [TypeScript](https://www.typescriptlang.org/)
- CLI colors by [Chalk](https://github.com/chalk/chalk)
- Interactive prompts by [Inquirer](https://github.com/SBoudrias/Inquirer.js)
- Git operations by [simple-git](https://github.com/steveukx/git-js)
- Testing with [Jest](https://jestjs.io/)
- Git hooks managed by [Husky](https://typicode.github.io/husky/)

## 📚 Related Projects

- [git-secrets](https://github.com/awslabs/git-secrets) - Amazon's solution for preventing secrets
- [detect-secrets](https://github.com/Yelp/detect-secrets) - Yelp's enterprise secret scanning
- [gitleaks](https://github.com/gitleaks/gitleaks) - SAST tool for detecting hardcoded secrets

## ⭐ Show Your Support

If this project helped you, please consider giving it a ⭐️!

## 📮 Contact

Looking for opportunities! If you have a position or project that needs:
- TypeScript/JavaScript development
- Security tooling
- CLI applications
- NPM package development

Feel free to reach out!

---

Made with ❤️ and TypeScript
