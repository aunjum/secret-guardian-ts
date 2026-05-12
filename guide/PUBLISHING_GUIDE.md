# 📦 NPM Package Publishing Guide - secret-guardian-ts

## 🎯 Complete Step-by-Step Instructions

### ✅ Pre-Publishing Checklist

Before publishing to npm, verify the following:

1. **All tests pass**: ✅ Done
2. **Build successful**: ✅ Done
3. **Git repository initialized**: ✅ Done
4. **License file exists**: ✅ Done (MIT License)
5. **README.md is comprehensive**: ⚠️ Review and update if needed
6. **package.json is properly configured**: ✅ Done

---

## 📝 Step 1: Update package.json with your GitHub info

**IMPORTANT**: Before publishing, update the repository URLs in `package.json`:

```json
"repository": {
  "type": "git",
  "url": "https://github.com/aunjum/secret-guardian-ts.git"
},
"bugs": {
  "url": "https://github.com/aunjum/secret-guardian-ts/issues"
},
"homepage": "https://github.com/aunjum/secret-guardian-ts#readme"
```

Replace `aunjum` with your actual GitHub username.

---

## 🔧 Step 2: Test the Package Locally

Before publishing, test your package locally:

### Option A: Using `npm link`

```bash
# In your secret-guardian project directory
npm link

# In another test project
npm link secret-guardian-ts

# Test it works
git init
git add .
git commit -m "test"

# Unlink when done
npm unlink secret-guardian-ts
```

### Option B: Using `npm pack`

```bash
# Create a tarball
npm pack

# This creates: secret-guardian-ts-1.0.0.tgz

# In another test project, install the tarball
npm install /path/to/secret-guardian-ts-1.0.0.tgz

# Test it works
git init
git add .
git commit -m "test"
```

---

## 🌐 Step 3: Create GitHub Repository (Optional but Recommended)

```bash
# Create repository on GitHub first, then:
git remote add origin https://github.com/aunjum/secret-guardian-ts.git
git branch -M main
git push -u origin main
```

---

## 🔑 Step 4: NPM Account Setup

### Create NPM Account (if you don't have one)

1. Go to: https://www.npmjs.com/signup
2. Fill in your details:
   - Username
   - Email
   - Password
3. Verify your email address

### Login to NPM

```bash
npm login
```

Enter:
- Username
- Password
- Email
- One-time password (if 2FA enabled)

Verify you're logged in:
```bash
npm whoami
```

---

## 🔍 Step 5: Check Package Name Availability

```bash
npm search secret-guardian-ts
```

If the name is taken, update the `name` field in `package.json`:

```json
{
  "name": "your-unique-package-name",
  ...
}
```

---

## 🏗️ Step 6: Build and Verify

```bash
# Clean build
rm -rf dist
npm run build

# Verify dist folder
ls dist/

# Should contain:
# - index.js
# - index.d.ts
# - scanner.js
# - scanner.d.ts
# - patterns.js
# - patterns.d.ts
# - hookInstaller.js
# - hookInstaller.d.ts
# - postinstall.js
# - postinstall.d.ts
```

---

## 🧪 Step 7: Run Final Tests

```bash
# Run all tests
npm test

# Run linting
npm run lint

# Test prepublishOnly script
npm run prepublishOnly
```

All tests should pass ✅

---

## 📤 Step 8: Publish to NPM

### First Time Publishing

```bash
npm publish
```

### If Package Name is Scoped (@yourname/package)

```bash
npm publish --access public
```

### Dry Run (Recommended First)

```bash
npm publish --dry-run
```

This shows what files will be published without actually publishing.

---

## ✅ Step 9: Verify Publication

After publishing:

1. Visit your package page:
   ```
   https://www.npmjs.com/package/secret-guardian-ts
   ```

2. Install from npm to test:
   ```bash
   # In a test project
   npm install secret-guardian-ts --save-dev
   ```

3. Test functionality:
   ```bash
   git init
   echo "AWS_KEY=AKIAIOSFODNN7EXAMPLE" > secret.txt
   git add .
   git commit -m "test commit"
   # Should trigger secret detection
   ```

---

## 🔄 Updating the Package (Future Releases)

### Update Version

Use semantic versioning:

```bash
# Patch release (1.0.0 -> 1.0.1) - bug fixes
npm version patch

# Minor release (1.0.0 -> 1.1.0) - new features
npm version minor

# Major release (1.0.0 -> 2.0.0) - breaking changes
npm version major
```

### Publish Update

```bash
npm publish
```

---

## 🛠️ Git Workflow

### Create New Feature

```bash
git checkout -b feature/new-pattern
# Make changes
git add .
git commit -m "feat: add new secret pattern detection"
git push origin feature/new-pattern
```

### Create Release Tag

```bash
# After version bump
git tag -a v1.0.1 -m "Release version 1.0.1"
git push origin v1.0.1
```

---

## 📊 Package Structure Overview

```
secret-guardian-ts/
├── dist/              # Compiled JavaScript (published)
├── src/               # TypeScript source (not published)
├── test/              # Test files (not published)
├── .husky/            # Git hooks (not published)
├── node_modules/      # Dependencies (not published)
├── package.json       # Package metadata (published)
├── README.md          # Documentation (published)
├── LICENSE            # MIT License (published)
├── .gitignore         # Git ignore rules
├── .npmignore         # NPM ignore rules
├── .gitattributes     # Git attributes
├── tsconfig.json      # TypeScript config (not published)
└── jest.config.js     # Jest config (not published)
```

**What gets published**: Only `dist/`, `package.json`, `README.md`, and `LICENSE`

---

## 🔥 Common Issues & Solutions

### Issue 1: Package name already exists
**Solution**: Change the name in `package.json` or use a scoped package `@yourname/package`

### Issue 2: 403 Forbidden
**Solution**: Run `npm login` again or check package name isn't protected

### Issue 3: Missing files in published package
**Solution**: Check `.npmignore` and `files` field in `package.json`

### Issue 4: Module not found after publish
**Solution**: Verify `main` and `types` fields in `package.json` point to correct files

### Issue 5: Hooks not installing
**Solution**: Ensure `postinstall` script runs and user has git initialized

---

## 🎨 Best Practices

1. ✅ **Always test locally** before publishing
2. ✅ **Use semantic versioning** correctly
3. ✅ **Write clear commit messages**
4. ✅ **Update README** for each major change
5. ✅ **Test in different environments** (Windows, Linux, Mac)
6. ✅ **Add CI/CD** for automated testing (GitHub Actions)
7. ✅ **Monitor package usage** on npm dashboard
8. ✅ **Respond to issues** on GitHub

---

## 📈 Post-Publishing Tasks

### 1. Add Badges to README

```markdown
[![npm version](https://badge.fury.io/js/secret-guardian-ts.svg)](https://www.npmjs.com/package/secret-guardian-ts)
[![Downloads](https://img.shields.io/npm/dm/secret-guardian-ts.svg)](https://www.npmjs.com/package/secret-guardian-ts)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
```

### 2. Create GitHub Release

1. Go to your GitHub repository
2. Click "Releases" → "Create a new release"
3. Tag version: `v1.0.0`
4. Release title: `Release v1.0.0`
5. Describe changes
6. Publish release

### 3. Share Your Package

- Tweet about it
- Post on Reddit (r/javascript, r/typescript)
- Share on Dev.to
- Add to Awesome lists

---

## 🚀 Quick Command Reference

```bash
# Development
npm run build          # Build TypeScript
npm test              # Run tests
npm run lint          # Type checking

# Version Management
npm version patch     # 1.0.0 → 1.0.1
npm version minor     # 1.0.0 → 1.1.0
npm version major     # 1.0.0 → 2.0.0

# Publishing
npm publish --dry-run # Test publish
npm publish           # Actual publish

# Git
git add .
git commit -m "message"
git push origin main
git tag v1.0.0
git push --tags

# NPM
npm login            # Login to npm
npm whoami           # Check logged in user
npm search <name>    # Check name availability
npm unpublish <pkg>@<version> --force  # Unpublish (within 72h)
```

---

## ⚠️ IMPORTANT NOTES

1. **You can only unpublish within 72 hours** of publishing
2. **Once published, a version cannot be re-published** (even after unpublishing)
3. **Always increment version** before republishing
4. **Test thoroughly** before publishing
5. **Keep your npm account secure** (enable 2FA)

---

## 📞 Support

If you encounter issues:
1. Check npm documentation: https://docs.npmjs.com/
2. Check GitHub issues
3. Contact npm support: https://www.npmjs.com/support

---

## ✨ Congratulations!

You're now ready to publish your npm package! 🎉

**Last checklist before `npm publish`:**
- [ ] Updated package.json repository URLs
- [ ] All tests passing
- [ ] Built successfully  
- [ ] Tested locally with npm link or npm pack
- [ ] Logged into npm
- [ ] Package name is available
- [ ] README is updated
- [ ] Version number is correct

**Then run:**
```bash
npm publish
```

Good luck! 🚀

