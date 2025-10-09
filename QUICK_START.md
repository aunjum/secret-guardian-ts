# 🚀 Quick Start Guide - Publishing to NPM

## Prerequisites Checklist ✅
- [x] Project built successfully
- [x] All tests passing (5/5 tests)
- [x] Git initialized and committed
- [x] Husky configured for git hooks
- [x] TypeScript compiled to dist/
- [x] README.md updated
- [x] LICENSE added (MIT)
- [x] .gitignore and .npmignore configured

## 📋 Step-by-Step Instructions

### 1️⃣ Update Package Info (REQUIRED)

Open `package.json` and update these fields:

```json
"repository": {
  "type": "git",
  "url": "https://github.com/YOUR_USERNAME/secret-guardian-ts.git"
},
"bugs": {
  "url": "https://github.com/YOUR_USERNAME/secret-guardian-ts/issues"
},
"homepage": "https://github.com/YOUR_USERNAME/secret-guardian-ts#readme"
```

Replace `YOUR_USERNAME` with your GitHub username.

### 2️⃣ Create GitHub Repository

1. Go to https://github.com/new
2. Name: `secret-guardian-ts`
3. Make it public
4. Don't initialize with README (we already have one)
5. Click "Create repository"

Then run:
```bash
git remote add origin https://github.com/YOUR_USERNAME/secret-guardian-ts.git
git branch -M main
git push -u origin main
```

### 3️⃣ Test Locally (HIGHLY RECOMMENDED)

```bash
# Create a test directory
cd ..
mkdir test-secret-guardian
cd test-secret-guardian

# Install your package locally
npm install ../secret-guardian

# Initialize git
git init

# Create a file with a fake secret
echo "AWS_KEY=AKIAIOSFODNN7EXAMPLE" > test.txt

# Try to commit (should trigger scanner)
git add .
git commit -m "test"
```

### 4️⃣ Login to NPM

```bash
npm login
```

Enter your NPM credentials:
- Username
- Password  
- Email
- 2FA code (if enabled)

Verify login:
```bash
npm whoami
```

### 5️⃣ Check Package Name

```bash
npm search secret-guardian-ts
```

If name is taken, update `"name"` in `package.json`.

### 6️⃣ Publish (DRY RUN)

```bash
npm publish --dry-run
```

Review what will be published.

### 7️⃣ Publish for Real! 🎉

```bash
npm publish
```

### 8️⃣ Verify Publication

Visit: https://www.npmjs.com/package/secret-guardian-ts

Try installing:
```bash
npm install secret-guardian-ts --save-dev
```

---

## 🔥 Quick Commands Reference

```bash
# Build
npm run build

# Test
npm test

# Publish
npm login
npm publish --dry-run  # Test first
npm publish            # Real publish

# Update version
npm version patch      # 1.0.0 → 1.0.1
npm version minor      # 1.0.0 → 1.1.0
npm version major      # 1.0.0 → 2.0.0

# Git
git status
git add .
git commit -m "message"
git push
```

---

## 📦 What Gets Published

Only these files/folders:
- ✅ `dist/` (compiled JavaScript)
- ✅ `package.json`
- ✅ `README.md`
- ✅ `LICENSE`

Everything else is excluded via `.npmignore`.

---

## ⚠️ Important Notes

1. **Cannot republish same version** - always bump version first
2. **Can only unpublish within 72 hours** of publishing
3. **Test thoroughly** before publishing
4. **Enable 2FA** on npm account for security

---

## 🎯 After Publishing

1. **Star your repo** on GitHub
2. **Add npm badge** to README
3. **Share on social media**
4. **Create GitHub release**
5. **Monitor for issues**

---

## 📞 Need Help?

See full guide: `PUBLISHING_GUIDE.md`

NPM Docs: https://docs.npmjs.com/
GitHub Docs: https://docs.github.com/

---

**You're ready to publish! 🚀**

Last check:
- [ ] Updated repository URLs in package.json
- [ ] Tested locally
- [ ] Logged into npm
- [ ] Package name available

Then run: `npm publish`

