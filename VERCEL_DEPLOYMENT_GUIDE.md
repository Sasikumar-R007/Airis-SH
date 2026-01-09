# Vercel Deployment Guide for Airis-SH Control Center

This guide provides step-by-step instructions for deploying the Airis-SH Control Center to Vercel.

---

## Prerequisites

Before deploying, ensure you have:

1. ✅ **Vercel Account** - Sign up at [vercel.com](https://vercel.com) (free tier available)
2. ✅ **Git Repository** - Your project should be in a Git repository (GitHub, GitLab, or Bitbucket)
3. ✅ **Node.js Installed** - For local testing (Node.js 16+ recommended)
4. ✅ **Project Built Successfully** - Test the build locally first

---

## Method 1: Deploy via Vercel Dashboard (Recommended for First Time)

### Step 1: Prepare Your Repository

1. **Ensure your project is in a Git repository:**
   ```bash
   # If not already a git repo, initialize it
   git init
   git add .
   git commit -m "Initial commit - Ready for Vercel deployment"
   ```

2. **Push to GitHub/GitLab/Bitbucket:**
   ```bash
   # Create a new repository on GitHub/GitLab/Bitbucket
   # Then push your code
   git remote add origin <your-repository-url>
   git branch -M main
   git push -u origin main
   ```

### Step 2: Deploy on Vercel

1. **Go to Vercel Dashboard:**
   - Visit [vercel.com](https://vercel.com)
   - Sign in or create an account
   - Click **"Add New Project"**

2. **Import Your Repository:**
   - Connect your GitHub/GitLab/Bitbucket account if not already connected
   - Select your repository (`Airis-SH` or your repo name)
   - Click **"Import"**

3. **Configure Project Settings:**
   - **Framework Preset:** Vite (should auto-detect)
   - **Root Directory:** `./` (leave as default)
   - **Build Command:** `npm run build` (should auto-detect)
   - **Output Directory:** `dist` (should auto-detect)
   - **Install Command:** `npm install` (should auto-detect)

4. **Environment Variables (if needed):**
   - Currently, no environment variables are required
   - Add any if needed in the future

5. **Deploy:**
   - Click **"Deploy"**
   - Wait for the build to complete (usually 1-3 minutes)

6. **Access Your Deployment:**
   - Once deployed, you'll get a URL like: `https://airis-sh.vercel.app`
   - The deployment is live and accessible!

---

## Method 2: Deploy via Vercel CLI (For Updates)

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

This will open a browser window for authentication.

### Step 3: Deploy from Project Directory

```bash
# Navigate to your project directory
cd "C:\Users\sasir\OneDrive\Documents\Sasikumar R\Airis-SH\Airis-SH Software\Airis-SH"

# Deploy to production
vercel --prod
```

**First Time Setup:**
- Vercel will ask some questions:
  - **Set up and deploy?** → Yes
  - **Which scope?** → Select your account/team
  - **Link to existing project?** → No (for first deployment)
  - **Project name?** → `airis-sh` (or your preferred name)
  - **Directory?** → `./` (current directory)
  - **Override settings?** → No (uses vercel.json)

**Subsequent Deployments:**
- Simply run `vercel --prod` to deploy updates

---

## Method 3: Automatic Deployments (Git Integration)

Once connected via Method 1, Vercel automatically deploys:

- **Every push to `main` branch** → Production deployment
- **Every push to other branches** → Preview deployment
- **Pull Requests** → Preview deployment with unique URL

### How It Works:

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Update: Added new features"
   git push origin main
   ```

2. **Vercel Automatically:**
   - Detects the push
   - Starts building
   - Deploys to production
   - Updates your live site

3. **Check Deployment Status:**
   - Go to Vercel Dashboard
   - View deployment logs
   - See build status

---

## Configuration Files

### vercel.json

The project includes a `vercel.json` file with optimal settings:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**Key Settings:**
- **rewrites:** Ensures React Router works correctly (SPA routing)
- **outputDirectory:** Points to Vite's build output
- **buildCommand:** Runs TypeScript check and Vite build

---

## Pre-Deployment Checklist

Before deploying, verify:

- [ ] **Build works locally:**
  ```bash
  npm run build
  ```
  - Should complete without errors
  - Creates `dist/` folder
  - No TypeScript errors

- [ ] **All assets are in `public/assets/`:**
  - Images (jpeg, jpg, png)
  - Videos (mp4)
  - PDF files
  - Logo

- [ ] **No hardcoded localhost URLs:**
  - Check for any `localhost:5000` references
  - Use relative paths for assets

- [ ] **Git repository is clean:**
  ```bash
  git status
  ```
  - Commit all changes
  - Push to remote repository

- [ ] **Environment variables (if any):**
  - Add in Vercel Dashboard → Settings → Environment Variables

---

## Testing the Deployment

### 1. Test Build Locally

```bash
# Build the project
npm run build

# Preview the build
npm run preview
```

Visit `http://localhost:4173` (or the port shown) to test.

### 2. Test on Vercel

After deployment:

1. **Visit your Vercel URL:**
   - Example: `https://airis-sh.vercel.app`

2. **Test All Pages:**
   - Dashboard
   - Gesture Settings
   - Comfort Mode
   - Accessibility Tools
   - Emergency & Caregiver
   - Device Settings
   - Air Mouse H-System
   - About

3. **Test Features:**
   - Navigation works
   - Images load correctly
   - Videos play
   - PDF downloads
   - External links work
   - Responsive design on mobile

---

## Troubleshooting

### Issue: Build Fails

**Error: TypeScript errors**
```bash
# Fix TypeScript errors locally first
npm run build
# Fix any errors shown
```

**Error: Missing dependencies**
```bash
# Ensure all dependencies are in package.json
npm install
npm run build
```

**Error: Asset not found**
- Check that files are in `public/assets/`
- Verify file names match exactly (case-sensitive)
- Check for spaces in file names (should be URL-encoded)

### Issue: 404 on Routes

**Problem:** React Router routes return 404

**Solution:** The `vercel.json` rewrite rule should fix this. Verify:
```json
"rewrites": [
  {
    "source": "/(.*)",
    "destination": "/index.html"
  }
]
```

### Issue: Images Not Loading

**Problem:** Images show broken or don't load

**Solutions:**
1. Check file paths in `assetHelper.ts`
2. Verify files are in `public/assets/`
3. Check browser console for 404 errors
4. Ensure file names match exactly

### Issue: Slow Build Times

**Problem:** Build takes too long

**Solutions:**
1. Check build logs in Vercel Dashboard
2. Optimize large assets (compress images/videos)
3. Consider using Vercel's Edge Network

---

## Custom Domain Setup

### Step 1: Add Domain in Vercel

1. Go to **Project Settings** → **Domains**
2. Click **"Add Domain"**
3. Enter your domain (e.g., `airis-sh.com`)
4. Follow DNS configuration instructions

### Step 2: Configure DNS

Add the following DNS records:

**For Root Domain:**
```
Type: A
Name: @
Value: 76.76.21.21
```

**For WWW Subdomain:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### Step 3: SSL Certificate

- Vercel automatically provisions SSL certificates
- HTTPS is enabled by default
- Certificate renews automatically

---

## Performance Optimization

### 1. Enable Caching

The `vercel.json` includes cache headers for assets:
```json
"headers": [
  {
    "source": "/assets/(.*)",
    "headers": [
      {
        "key": "Cache-Control",
        "value": "public, max-age=31536000, immutable"
      }
    ]
  }
]
```

### 2. Optimize Assets

- Compress images before uploading
- Use WebP format when possible
- Optimize videos (compress, reduce resolution)

### 3. Enable Compression

Vercel automatically enables:
- Gzip compression
- Brotli compression
- Image optimization

---

## Monitoring & Analytics

### Vercel Analytics (Optional)

1. Go to **Project Settings** → **Analytics**
2. Enable **Web Analytics** (free tier available)
3. View:
   - Page views
   - Unique visitors
   - Performance metrics
   - Geographic data

### Deployment Logs

- View build logs in Vercel Dashboard
- Check for errors or warnings
- Monitor deployment times

---

## Updating Your Deployment

### Quick Update Process

1. **Make changes locally:**
   ```bash
   # Edit files
   # Test locally: npm run dev
   ```

2. **Commit and push:**
   ```bash
   git add .
   git commit -m "Update: Description of changes"
   git push origin main
   ```

3. **Vercel automatically:**
   - Detects the push
   - Builds the project
   - Deploys to production
   - Updates live site (usually in 1-3 minutes)

### Manual Deployment

If automatic deployment is disabled:

```bash
vercel --prod
```

---

## Rollback to Previous Version

If something goes wrong:

1. Go to **Vercel Dashboard** → **Deployments**
2. Find the previous working deployment
3. Click **"..."** → **"Promote to Production"**
4. Your site is rolled back instantly

---

## Environment-Specific Deployments

### Production
- **Branch:** `main`
- **URL:** `https://airis-sh.vercel.app`
- **Auto-deploys:** Yes

### Preview
- **Branch:** Any branch except `main`
- **URL:** `https://airis-sh-<branch-name>.vercel.app`
- **Auto-deploys:** Yes

### Development
- **Local:** `npm run dev`
- **URL:** `http://localhost:5000`

---

## Best Practices

1. **Always test locally first:**
   ```bash
   npm run build
   npm run preview
   ```

2. **Use meaningful commit messages:**
   ```bash
   git commit -m "Fix: Image loading issue"
   git commit -m "Feature: Add video support"
   ```

3. **Monitor deployments:**
   - Check Vercel Dashboard after each deployment
   - Review build logs for warnings

4. **Keep dependencies updated:**
   ```bash
   npm outdated
   npm update
   ```

5. **Use preview deployments:**
   - Test on preview URL before merging to main
   - Share preview URLs for testing

---

## Quick Reference Commands

```bash
# Build locally
npm run build

# Preview build
npm run preview

# Deploy to Vercel (CLI)
vercel --prod

# Check deployment status
vercel ls

# View deployment logs
vercel logs

# Remove deployment
vercel remove
```

---

## Support & Resources

- **Vercel Documentation:** [vercel.com/docs](https://vercel.com/docs)
- **Vite Deployment Guide:** [vitejs.dev/guide/static-deploy.html](https://vitejs.dev/guide/static-deploy.html)
- **Vercel Status:** [vercel-status.com](https://vercel-status.com)
- **Vercel Community:** [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)

---

## Deployment Checklist

Before deploying, ensure:

- [ ] Project builds successfully (`npm run build`)
- [ ] All assets are in `public/assets/`
- [ ] No TypeScript errors
- [ ] All changes committed to Git
- [ ] Pushed to remote repository
- [ ] `vercel.json` is configured
- [ ] Tested locally with `npm run preview`

---

**Ready to Deploy?** Follow Method 1 for first-time deployment, or Method 2 for quick updates!

**Current Deployment URL:** [https://airis-sh.vercel.app](https://airis-sh.vercel.app)

---

*Last Updated: January 2025*

