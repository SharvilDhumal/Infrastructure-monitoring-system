# Quick Start Guide

## Step-by-Step Setup

### 1. Install Node.js
If you don't have Node.js installed:
- Download from: https://nodejs.org/
- Install the LTS version
- Verify installation: Open terminal and run `node --version`

### 2. Install Project Dependencies
Open terminal in the project folder and run:
```bash
npm install
```

**Wait for this to complete** - it may take 1-2 minutes. You'll see "added X packages" when done.

### 3. Start Development Server
```bash
npm run dev
```

### 4. Open in Browser
The terminal will show a URL like:
```
➜  Local:   http://localhost:5173/
```

Click that URL or copy it into your browser.

## Common Commands

| Command | Purpose |
|---------|---------|
| `npm install` | Install all dependencies (run this first!) |
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

## If Something Goes Wrong

1. **"vite is not recognized"**
   - Solution: Run `npm install` first, then use `npm run dev`

2. **"Cannot find module"**
   - Solution: Delete `node_modules` folder and run `npm install` again

3. **Port already in use**
   - Solution: Close other applications using port 5173, or Vite will auto-select another port

4. **Still having issues?**
   - Make sure Node.js version is 16 or higher: `node --version`
   - Try deleting `node_modules` and `package-lock.json`, then run `npm install` again































