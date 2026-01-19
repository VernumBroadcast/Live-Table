# How to Make Your Tournament Table Public

## Option 1: GitHub Pages (Recommended - Free & Easy)

1. **Create a GitHub account** (if you don't have one): https://github.com

2. **Create a new repository:**
   - Go to GitHub and click "New repository"
   - Name it (e.g., "tournament-table")
   - Make it **Public**
   - Don't initialize with README
   - Click "Create repository"

3. **Upload your files:**
   - In your repository, click "uploading an existing file"
   - Drag and drop all your files:
     - `output.html`
     - `output.css`
     - `output.js`
     - `admin.html`
     - `admin.css`
     - `admin.js`
     - `data.js`
     - `flag-mapping.js`
     - `BACKDROP.png`
     - `Cairo-Bold.ttf`
     - `Flags Updated/` folder (all flag images)
   - Click "Commit changes"

4. **Enable GitHub Pages:**
   - Go to Settings → Pages
   - Under "Source", select "main" branch and "/ (root)"
   - Click "Save"
   - Your site will be live at: `https://yourusername.github.io/repository-name`

5. **Access your pages:**
   - Public output page: `https://yourusername.github.io/repository-name/output.html`
   - Admin page: `https://yourusername.github.io/repository-name/admin.html`

---

## Option 2: Netlify Drop (Easiest - No Account Needed)

1. **Go to:** https://app.netlify.com/drop

2. **Drag and drop** your entire project folder

3. **Get instant URL** - Your site is live immediately!

4. **For admin access:** Add `/admin.html` to the URL

---

## Option 3: Netlify with Git (Best for Updates)

1. **Create a GitHub repository** (follow Option 1 steps 1-3)

2. **Go to:** https://app.netlify.com

3. **Sign up/login** with GitHub

4. **Click "Add new site" → "Import an existing project"**

5. **Connect to GitHub** and select your repository

6. **Deploy settings:**
   - Build command: (leave empty - no build needed)
   - Publish directory: `/` (root)
   - Click "Deploy site"

7. **Your site is live!** You'll get a URL like `https://random-name.netlify.app`

8. **Custom domain (optional):** Add your own domain in Site settings

---

## Option 4: Vercel (Also Free)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **In your project folder, run:**
   ```bash
   vercel
   ```

3. **Follow the prompts** - your site will be deployed!

---

## Important Notes:

- **All files must be uploaded** including:
  - HTML files
  - CSS files
  - JavaScript files
  - Images (BACKDROP.png, flags)
  - Fonts (Cairo-Bold.ttf)
  - The `Flags Updated` folder with all flag images

- **Admin settings are stored in localStorage** - each browser/user has their own settings

- **For public display:** Share the `output.html` URL

- **For admin access:** Share the `admin.html` URL (or keep it private)

---

## Quick Start (GitHub Pages):

If you want the fastest setup, use GitHub Pages:

1. Create GitHub repo
2. Upload all files
3. Enable Pages in Settings
4. Done!

Your tournament table will be accessible to anyone with the URL.
