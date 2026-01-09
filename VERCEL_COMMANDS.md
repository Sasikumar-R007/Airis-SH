# Vercel Deployment Commands - Quick Reference

## Required Vercel Configuration

### Build Command

```
npm run build
```

### Output Directory

```
dist
```

### Install Command

```
npm install
```

### Development Command

```
npm run dev
```

### Framework Preset

```
Vite
```

---

## Complete Vercel Settings

When setting up in Vercel Dashboard, use these exact values:

| Setting                 | Value                   |
| ----------------------- | ----------------------- |
| **Framework Preset**    | `Vite`                  |
| **Root Directory**      | `./` (leave as default) |
| **Build Command**       | `npm run build`         |
| **Output Directory**    | `dist`                  |
| **Install Command**     | `npm install`           |
| **Development Command** | `npm run dev`           |

---

## Package.json Scripts Reference

From your `package.json`:

```json
{
  "scripts": {
    "dev": "vite --host 0.0.0.0 --port 5000",
    "build": "tsc && vite build",
    "preview": "vite preview"
  }
}
```

**Explanation:**

- `dev`: Starts development server
- `build`: TypeScript check + Vite production build
- `preview`: Preview production build locally

---

## Vercel Auto-Detection

Vercel will **automatically detect** these settings if:

- ✅ `vercel.json` is present (already created)
- ✅ `package.json` has build scripts
- ✅ Framework is Vite

**You can leave settings as auto-detected or manually set them.**

---

## Manual Configuration (if needed)

If Vercel doesn't auto-detect, manually enter:

### In Vercel Dashboard:

1. **Project Settings** → **General**
2. **Build & Development Settings:**
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
   - Development Command: `npm run dev`

---

## Environment Variables

**Currently Required:** None

**Optional (for future):**

- `NODE_ENV=production` (auto-set by Vercel)
- Any API keys if you add backend features

---

## Quick Copy-Paste for Vercel Dashboard

```
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
Development Command: npm run dev
Root Directory: ./
```

---

## Verification Commands

Test these commands locally before deploying:

```bash
# 1. Install dependencies
npm install

# 2. Build project
npm run build

# 3. Preview build (optional)
npm run preview
```

**Expected Result:**

- ✅ `dist/` folder created
- ✅ No TypeScript errors
- ✅ All assets in `dist/assets/`
- ✅ `index.html` in `dist/`

---

## Common Issues & Solutions

### Issue: Build fails with "Command not found"

**Solution:** Ensure `npm install` runs first (Vercel does this automatically)

### Issue: Output directory not found

**Solution:** Verify `dist` folder is created after `npm run build`

### Issue: TypeScript errors

**Solution:** Fix errors locally first:

```bash
npm run build
# Fix any TypeScript errors shown
```

---

## Vercel.json Configuration

Your `vercel.json` already includes these settings:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite"
}
```

**Note:** Vercel will use these settings automatically if `vercel.json` exists.

---

## Deployment Checklist

Before deploying, verify:

- [ ] `npm run build` works locally
- [ ] `dist/` folder is created
- [ ] No build errors
- [ ] All assets are accessible
- [ ] `vercel.json` is in project root

---

**Ready to Deploy!** Use these exact commands in Vercel Dashboard.
